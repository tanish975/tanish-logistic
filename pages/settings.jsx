import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { FileUpload } from '@/components/ui/FileUpload';


const SettingsPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const logoUrl = watch('logoUrl');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/general');
        const data = await response.json();
        reset(data); // Populate the form with fetched data
      } catch (error) {
        toast.error('Failed to load settings.');
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Site Settings - Tanish Logistic</title>
      </Head>
      <Toaster richColors />
      <div className="flex min-h-screen w-full flex-col bg-gray-50">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <h1 className="text-xl font-bold">Site Settings</h1>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="siteName" className="text-sm font-medium text-foreground">Site Name</label>
                    <Input id="siteName" {...register("siteName", { required: "Site name is required" })} className="border-input bg-background" />
                    {errors.siteName && <p className="text-red-500 text-xs">{errors.siteName.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="slogan" className="text-sm font-medium text-foreground">Slogan</label>
                    <Input id="slogan" {...register("slogan")} className="border-input bg-background" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="contactDetails" className="text-sm font-medium text-foreground">Contact Details</label>
                    <Input id="contactDetails" {...register("contactDetails")} className="border-input bg-background" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="copyright" className="text-sm font-medium text-foreground">Copyright</label>
                    <Input id="copyright" {...register("copyright")} className="border-input bg-background" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance and Theming</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="logoUrl" className="text-sm font-medium text-foreground">Logo</label>
                    <FileUpload onUploadSuccess={(url) => setValue('logoUrl', url, { shouldDirty: true })} />
                    {logoUrl && <img src={logoUrl} alt="Logo Preview" className="h-20 mt-2" />}
                    <Input id="logoUrl" {...register("logoUrl")} className="hidden" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="primaryColor" className="text-sm font-medium text-foreground">Primary Color</label>
                    <Controller
                      name="primaryColor"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" style={{ backgroundColor: field.value }}>
                              {field.value || "Select Color"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto">
                            <HexColorPicker color={field.value} onChange={field.onChange} />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="secondaryColor" className="text-sm font-medium text-foreground">Secondary Color</label>
                    <Controller
                      name="secondaryColor"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" style={{ backgroundColor: field.value }}>
                              {field.value || "Select Color"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto">
                            <HexColorPicker color={field.value} onChange={field.onChange} />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Functional Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="paymentApiKey" className="text-sm font-medium text-foreground">Payment Gateway API Key</label>
                    <Input id="paymentApiKey" {...register("paymentApiKey")} className="border-input bg-background" />
                  </div>
                  {/* Add more fields for toggling features, other API keys, etc. later */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Management Defaults</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="defaultPostStatus" className="text-sm font-medium text-foreground">Default Post Status</label>
                    <Controller
                      name="defaultPostStatus"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="border-input bg-background">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="commentModeration" className="text-sm font-medium text-foreground">Comment Moderation</label>
                    <Controller
                      name="commentModeration"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="border-input bg-background">
                            <SelectValue placeholder="Select a moderation rule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security and User Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="passwordPolicy" className="text-sm font-medium text-foreground">Password Policy</label>
                    <Input id="passwordPolicy" {...register("passwordPolicy")} className="border-input bg-background" />
                  </div>
                  {/* Add more fields for user roles/permissions later */}
                </CardContent>
              </Card>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save All Settings'}
              </Button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;