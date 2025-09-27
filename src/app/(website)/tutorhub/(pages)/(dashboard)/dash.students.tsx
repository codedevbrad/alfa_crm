import { Settings } from 'lucide-react' 

export default function StudentsTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-gray-600" />
        Students
      </h3>
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="h-8 w-8 text-gray-500" />
        </div>
        <p className="text-lg font-medium">Students panel will be implemented here</p>
      </div>
    </div>
  );
}