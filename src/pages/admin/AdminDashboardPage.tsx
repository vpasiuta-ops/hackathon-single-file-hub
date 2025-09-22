import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Calendar, Mail, BarChart } from 'lucide-react';
import UsersManagement from '@/components/admin/UsersManagement';
import TeamsManagement from '@/components/admin/TeamsManagement';
import HackathonsManagement from '@/components/admin/HackathonsManagement';
import EmailManagement from '@/components/admin/EmailManagement';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-6 w-6" />
            Панель адміністратора
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Користувачі
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Команди
          </TabsTrigger>
          <TabsTrigger value="hackathons" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Хакатони
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email-розсилки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsManagement />
        </TabsContent>

        <TabsContent value="hackathons">
          <HackathonsManagement />
        </TabsContent>

        <TabsContent value="emails">
          <EmailManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}