'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Key, Calendar, Shield } from 'lucide-react';
import { toast } from "sonner";

// Server actions
import { getCalendarKey, saveCalendarKey } from './calendar.db';

export default function CapturingCalendarKey() {
  const [apiKey, setApiKey] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCalendarKey();
        if (data) {
          setApiKey(data.apiKey);
          setCalendarId(data.calendarId);
          setHasKey(true);
        }
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim() || !calendarId.trim()) {
      toast.error("Missing fields", {
        description: "Please enter both the API key and calendar ID.",
      });
      return;
    }

    setSaving(true);
    try {
      await saveCalendarKey({ apiKey: apiKey.trim(), calendarId: calendarId.trim() });
      toast.success("Calendar key saved successfully!", {
        description: "Your credentials have been encrypted and stored securely.",
      });
      setHasKey(true);
    } catch (err) {
      console.error('Save error:', err);
      toast.error("Failed to save", {
        description: "Something went wrong while saving your credentials. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-sm text-muted-foreground">Loading your calendar settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Google Calendar Integration</CardTitle>
        <CardDescription className="text-base max-w-md mx-auto">
          Connect your Google Calendar to enable schedule management. Your credentials are encrypted and stored securely.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {hasKey && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle2 className="text-green-600 w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Calendar integration is active
              </p>
              <p className="text-xs text-green-600">
                Your API credentials are saved and working properly.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4" />
              Google Calendar API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              maxLength={300}
              placeholder="AIzaSyC-YourGoogleCalendarAPIKey..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Generate this from the{' '}
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendar-id" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar ID
            </Label>
            <Input
              id="calendar-id"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              maxLength={300}
              placeholder="your-email@gmail.com or calendar-id"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Usually your Gmail address, or find it in Calendar Settings → Calendar ID
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-gray-50 rounded-md p-3">
          <Shield className="w-4 h-4" />
          <span>
            Your API credentials are encrypted before storage and never shared with third parties.
          </span>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving || !apiKey.trim() || !calendarId.trim()}
          className="w-full"
          size="lg"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Saving credentials...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {hasKey ? "Update Credentials" : "Save Credentials"}
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}