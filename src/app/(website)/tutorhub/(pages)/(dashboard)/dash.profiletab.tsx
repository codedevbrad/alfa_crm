// Enhanced Profile Tab Component...
import { TutorProfile , User } from '@/generated/prisma'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users,  DollarSign, Star,  Edit3 } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ProfileTab({ tutor, tutorProfile }: { tutor: User; tutorProfile: TutorProfile }) {
  const getInitials = (name: string | null) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
      <div className="relative px-6 py-4 border-b border-border bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Tutor Profile
        </h3>
      </div>
      <div className="px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-border">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={tutor.image || undefined} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
              {getInitials(tutor.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-xl font-bold text-foreground">{tutor.name || 'Not provided'}</h4>
            <p className="text-muted-foreground">{tutor.email}</p>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-foreground">5.0 Rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border">
              {tutor.name || 'Not provided'}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border">
              {tutor.email}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Hourly Rate</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              {tutorProfile.hourlyRate || 'Not set'}
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Profile Created</label>
            <p className="text-foreground font-medium p-3 bg-accent/50 rounded-lg border border-border">
              {new Date(tutorProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">Bio</label>
          <p className="text-foreground p-4 bg-accent/50 rounded-lg border border-border min-h-[100px]">
            {tutorProfile.bio || 'No bio provided yet. Add a compelling bio to attract more students!'}
          </p>
        </div>
        
        <div className="pt-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}