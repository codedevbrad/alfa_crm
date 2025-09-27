"use client"

import React, { useEffect, useMemo, useState, useTransition } from "react"
import { Check, Star, Crown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { plans } from "./plans"
import {
  startFreeTierAction,
  purchaseBasicAction,
  purchaseTutoredAction,
  getTutorsAction,
  getMySubscriptionAction,
} from "@/lib/db/models/subscription/db.student.queries"

type PlanKey = keyof typeof plans

type TutorLite = { tutorProfileId: string; name: string; image: string | null; hourlyRate: string | null }

type CurrentSubLite = {
  id: string
  tier: "FREE" | "BASIC" | "TUTORED"
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING"
  startDate: string
  endDate: string | null
  tutor: { tutorProfileId: string; name: string; image: string | null } | null
} | null

function normalizeSelectedToDbTier(k: PlanKey): "FREE" | "BASIC" | "TUTORED" {
  if (k === "FREE") return "FREE"
  if (k === "BASIC") return "BASIC"
  return "TUTORED"
}

function formatDate(d?: string | null) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return null
  }
}

function tierLabel(t?: "FREE" | "BASIC" | "TUTORED" | null) {
  if (!t) return "None"
  return t === "FREE" ? "Free" : t === "BASIC" ? "Basic" : "Tutored"
}

const SubscriptionModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<PlanKey>("BASIC")

  // current subscription
  const [current, setCurrent] = useState<CurrentSubLite>(null)

  // tutored flow
  const [step, setStep] = useState<1 | 2>(1)
  const [tutors, setTutors] = useState<TutorLite[]>([])
  const [selectedTutorProfileId, setSelectedTutorProfileId] = useState<string | null>(null)

  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  // Fetch current subscription on mount (so trigger button can show it)
  useEffect(() => {
    startTransition(async () => {
      try {
        const sub = await getMySubscriptionAction()
        setCurrent(sub)
      } catch (e: any) {
        // ignore for trigger; we’ll fetch again on open
      }
    })
  }, [])

  // Load current subscription on open (to refresh state)
  useEffect(() => {
    if (!isOpen) return
    startTransition(async () => {
      try {
        const sub = await getMySubscriptionAction()
        setCurrent(sub)
        // auto-select the current tier (maps to our plan keys)
        if (sub?.tier === "FREE") setSelectedTier("FREE")
        else if (sub?.tier === "BASIC") setSelectedTier("BASIC")
        else if (sub?.tier === "TUTORED") setSelectedTier("TUTORED")
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load current subscription.")
      }
    })
  }, [isOpen])

  // Fetch tutors when opening Tutored
  useEffect(() => {
    if (!isOpen || selectedTier !== "TUTORED") return
    startTransition(async () => {
      try {
        const list = await getTutorsAction()
        setTutors(list)
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load tutors.")
      }
    })
  }, [isOpen, selectedTier])

  // Reset flow when tier/open changes
  useEffect(() => {
    setStep(1)
    setSelectedTutorProfileId(null)
    setMsg(null)
    setErr(null)
  }, [selectedTier, isOpen])

  const selectedDbTier = useMemo(() => normalizeSelectedToDbTier(selectedTier), [selectedTier])
  const isAlreadyOnSelected = current?.tier === selectedDbTier && current?.status === "ACTIVE"
  const currentEnd = formatDate(current?.endDate)

  async function refreshCurrent() {
    try {
      const sub = await getMySubscriptionAction()
      setCurrent(sub)
    } catch {}
  }

  const PlanCard = ({ tier, plan }: { tier: PlanKey; plan: (typeof plans)[PlanKey] }) => {
    const isSelected = selectedTier === tier
    const isCurrentCard = current?.tier === normalizeSelectedToDbTier(tier) && current?.status === "ACTIVE"
    const Icon = plan.icon
    const currentPrice = plan.price.annual

    return (
      <Card
        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
          isSelected ? `${plan.borderColor} ${plan.glowColor} shadow-2xl border-2` : "hover:shadow-lg border-2 border-muted"
        }`}
        onClick={() => setSelectedTier(tier)}
      >
        {/* badges */}
        {plan.popular && !isCurrentCard && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}
        {plan.premium && !isCurrentCard && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
        {isCurrentCard && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-green-600 text-white border-0">Current Plan</Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4 mx-auto`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl mb-2">{plan.name}</DialogTitle>
          <p className="text-muted-foreground text-sm">{plan.description}</p>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">${currentPrice}</span>
              {tier !== "FREE" && <span className="text-muted-foreground text-lg">/year</span>}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {plan.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {isSelected && <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-600/10 pointer-events-none" />}
        </CardContent>
      </Card>
    )
  }

  function PurchaseControls() {
    // FREE
    if (selectedDbTier === "FREE") {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            size="lg"
            disabled={pending || isAlreadyOnSelected}
            onClick={() =>
              startTransition(async () => {
                try {
                  setErr(null); setMsg(null)
                  const res = await startFreeTierAction()
                  if (res.ok) { setMsg("🎉 Free plan activated!"); await refreshCurrent() } else setMsg("Something went wrong.")
                } catch (e: any) {
                  setErr(e?.message ?? "Failed to activate Free.")
                }
              })
            }
            className="bg-gradient-to-r from-slate-600 to-slate-800 text-white"
          >
            {isAlreadyOnSelected ? "You're on Free" : "Get Started Free"}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setIsOpen(false)} className="font-semibold">
            Close
          </Button>
        </div>
      )
    }

    // BASIC
    if (selectedDbTier === "BASIC") {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            size="lg"
            disabled={pending || isAlreadyOnSelected}
            onClick={() =>
              startTransition(async () => {
                try {
                  setErr(null); setMsg(null)
                  const res = await purchaseBasicAction()
                  if (res.ok) { setMsg("🎉 Basic (Annual) activated!"); await refreshCurrent() } else setMsg("Something went wrong.")
                } catch (e: any) {
                  setErr(e?.message ?? "Failed to purchase Basic.")
                }
              })
            }
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {isAlreadyOnSelected ? "You're on Basic" : "Confirm Basic (Annual)"}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setIsOpen(false)} className="font-semibold">
            Close
          </Button>
        </div>
      )
    }

    // TUTORED: 2 steps
    if (selectedDbTier === "TUTORED") {
      if (isAlreadyOnSelected) {
        return (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              You’re already on the Tutored plan{current?.tutor ? ` with ${current.tutor.name}` : ""}.
            </p>
            <Button variant="outline" size="lg" onClick={() => setIsOpen(false)} className="mt-3">
              Close
            </Button>
          </div>
        )
      }

      return (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4 text-sm">
            <span className={`px-2 py-1 rounded ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>1. Choose tutor</span>
            <span>→</span>
            <span className={`px-2 py-1 rounded ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>2. Confirm</span>
          </div>

          {step === 1 && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md">
                <label className="block text-sm mb-2">Select a tutor</label>
                <Select
                  value={selectedTutorProfileId ?? undefined}
                  onValueChange={setSelectedTutorProfileId}
                  disabled={pending} 
                >
                  <SelectTrigger>
                    <SelectValue placeholder={pending ? "Loading tutors..." : "Pick a tutor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {tutors.map((t) => (
                      <SelectItem key={t.tutorProfileId} value={t.tutorProfileId}>
                        {t.name} {t.hourlyRate ? `• £${t.hourlyRate}/hr` : ""}
                      </SelectItem>
                    ))}
                    {tutors.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">No tutors available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button disabled={!selectedTutorProfileId} onClick={() => setStep(2)}>Continue</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Tutor chosen: {tutors.find((t) => t.tutorProfileId === selectedTutorProfileId)?.name}
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      try {
                        setErr(null); setMsg(null)
                        const fd = new FormData()
                        if (selectedTutorProfileId) fd.set("tutorProfileId", selectedTutorProfileId)
                        const res = await purchaseTutoredAction(fd)
                        if (res.ok) { setMsg("🎉 Tutored (Annual) activated!"); await refreshCurrent() } else setErr(res.error ?? "Failed to purchase Tutored.")
                      } catch (e: any) {
                        setErr(e?.message ?? "Failed to purchase Tutored.")
                      }
                    })
                  }
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl"
                >
                  Confirm Tutored (Annual)
                </Button>
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  const triggerText = current?.status === "ACTIVE" ? `${tierLabel(current.tier)} Subscription Plan` : "Choose a Plan";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Crown className="w-5 h-5 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="!w-[80vw] !max-w-[80vw] !h-[80vh] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-t-lg flex-shrink-0">
        
          <DialogHeader className="text-center text-white">
            <DialogTitle className="text-4xl font-bold mb-2 text-white">Choose Your Learning Journey</DialogTitle>

            {/* Current plan strip */}
            {current ? (
              <div className="mt-2">
                <Badge className="bg-black/30 text-white border-0">
                  Current: {current.tier}
                  {currentEnd ? ` • Renews/ends ${currentEnd}` : ""}
                  {current.tutor ? ` • Tutor: ${current.tutor.name}` : ""}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-white/80 mt-2">No active plan</p>
            )}

            <p className="text-sm text-white/80 mt-4">Annual billing only • Best value, simple pricing</p>
          </DialogHeader>
        </div>

        {/* Plans */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(plans).map(([tier, plan]) => (
              <PlanCard key={tier} tier={tier as PlanKey} plan={plan} />
            ))}
          </div>

        {/* Purchase flow */}
        <PurchaseControls />

        {/* Messages */}
        {msg && <p className="text-center text-sm text-green-600 mb-4">{msg}</p>}
        {err && <p className="text-center text-sm text-red-600 mb-4">{err}</p>}

      </div>
    </DialogContent>
  </Dialog>
  )
}

export default SubscriptionModal
