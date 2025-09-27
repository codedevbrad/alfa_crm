// Enhanced placeholder components for other tabs
import { Calendar } from 'lucide-react' 
export default function SessionsTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
        Sessions
      </h3>
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-lg font-medium">Sessions management will be implemented here</p>
      </div>
    </div>
  );
}
