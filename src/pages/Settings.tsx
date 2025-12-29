import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Truck,
  CreditCard,
  Database,
  Globe,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SettingsSection = 'profile' | 'company' | 'notifications' | 'security' | 'appearance' | 'fleet' | 'billing' | 'integrations';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal information' },
  { id: 'company', label: 'Company', icon: Building2, description: 'Organization settings and preferences' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure alert preferences' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password and authentication' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and display settings' },
  { id: 'fleet', label: 'Fleet Settings', icon: Truck, description: 'Vehicle and route preferences' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Subscription and payment' },
  { id: 'integrations', label: 'Integrations', icon: Globe, description: 'Third-party connections' },
] as const;

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
                AD
              </div>
              <div>
                <h3 className="text-lg font-semibold">Admin User</h3>
                <p className="text-muted-foreground">admin@logicore.com</p>
                <button className="mt-2 text-sm text-primary hover:underline">Change photo</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full h-10 px-3 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  defaultValue="User"
                  className="w-full h-10 px-3 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  defaultValue="admin@logicore.com"
                  className="w-full h-10 px-3 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full h-10 px-3 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-dark transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id as typeof theme)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                      theme === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn(
                      "w-6 h-6",
                      theme === option.id ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium">{option.label}</span>
                    {theme === option.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Display Preferences</h3>
              
              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/50 cursor-pointer">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                </div>
                <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer transition-colors">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground rounded-full transition-transform" />
                </div>
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/50 cursor-pointer">
                <div>
                  <p className="font-medium">Animations</p>
                  <p className="text-sm text-muted-foreground">Enable interface animations</p>
                </div>
                <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer transition-colors">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                </div>
              </label>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            
            {[
              { title: 'Exception Alerts', description: 'Get notified about delivery exceptions and issues', enabled: true },
              { title: 'Temperature Alerts', description: 'Receive alerts when refrigerated trucks have issues', enabled: true },
              { title: 'Route Updates', description: 'Notifications about route changes and delays', enabled: false },
              { title: 'Settlement Reminders', description: 'Daily reminders for pending settlements', enabled: true },
              { title: 'System Updates', description: 'Updates about new features and maintenance', enabled: false },
            ].map((notification, index) => (
              <motion.label
                key={notification.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <div className={cn(
                  "w-11 h-6 rounded-full relative cursor-pointer transition-colors",
                  notification.enabled ? "bg-primary" : "bg-muted"
                )}>
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                    notification.enabled ? "right-1" : "left-1"
                  )} />
                </div>
              </motion.label>
            ))}
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Connected Services</h3>
            
            {[
              { name: 'FedEx', description: 'Carrier integration for external shipments', connected: true, logo: '📦' },
              { name: 'UPS', description: 'Carrier integration for external shipments', connected: true, logo: '🚚' },
              { name: 'Mapbox', description: 'Live maps and route visualization', connected: true, logo: '🗺️' },
              { name: 'QuickBooks', description: 'Financial data synchronization', connected: false, logo: '💰' },
              { name: 'Salesforce', description: 'Customer relationship management', connected: false, logo: '☁️' },
            ].map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                    {integration.logo}
                  </div>
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <button className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  integration.connected
                    ? "bg-success text-success-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary-dark"
                )}>
                  {integration.connected ? 'Connected' : 'Connect'}
                </button>
              </motion.div>
            ))}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Settings content for {activeSection}</p>
              <p className="text-sm">Coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 border-r border-border p-4 space-y-1"
        >
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <section.icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{section.label}</p>
                <p className={cn(
                  "text-xs truncate",
                  activeSection === section.id ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {section.description}
                </p>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 flex-shrink-0",
                activeSection === section.id ? "text-primary-foreground" : "text-muted-foreground"
              )} />
            </button>
          ))}
        </motion.nav>

        {/* Content */}
        <motion.main
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-8"
        >
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-6">
              {settingsSections.find(s => s.id === activeSection)?.label}
            </h2>
            {renderContent()}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Settings;