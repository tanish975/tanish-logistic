import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { FileUpload } from '@/components/ui/FileUpload';
import BrandLogo from '@/components/Layout/BrandLogo';


const SettingsPage = ({ embedded = false }) => {
  const Content = embedded ? 'div' : 'main';
  const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [loadState, setLoadState] = useState('loading');
  const logoUrl = watch('logoUrl');

  const fetchSettings = useCallback(async () => {
    setLoadState('loading');
    try {
      const response = await fetch('/api/settings/general');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      reset(data);
      setLoadState('ready');
    } catch {
      setLoadState('error');
      toast.error('Failed to load settings.');
    }
  }, [reset]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

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
      {!embedded && <Head><title>Site Settings - Tanish Logistic</title></Head>}
      {!embedded && <Toaster richColors />}
      <div className={embedded ? 'w-full' : 'flex min-h-screen w-full flex-col bg-gray-50'}>
        <div className={embedded ? 'space-y-5' : 'flex flex-col sm:gap-4 sm:py-4 sm:pl-14'}>
          <header className={embedded ? 'space-y-1.5' : 'sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'}>
            {embedded ? <><h2 className="text-2xl font-bold tracking-tight text-slate-950">Site settings</h2><p className="text-sm text-slate-600">Manage your website information and configuration.</p></> : <h1 className="text-xl font-bold">Site Settings</h1>}
          </header>
          <Content className={embedded ? 'min-w-0' : 'grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'}>
            {loadState === 'loading' ? <p role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading settings…</p> : loadState === 'error' ? <p role="alert" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">Could not load settings. <button type="button" onClick={fetchSettings} className="font-semibold text-sky-700 underline underline-offset-2">Try again</button></p> : <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold leading-6 text-slate-900">General Information</CardTitle>
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
                  <CardTitle className="text-base font-bold leading-6 text-slate-900">Appearance and Theming</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="site-logo-upload" className="text-sm font-medium text-foreground">Logo</label>
                    <FileUpload id="site-logo-upload" onUploadSuccess={(url) => setValue('logoUrl', url, { shouldDirty: true })} />
                    {logoUrl && <BrandLogo src={logoUrl} alt="Logo preview" className="mt-2 h-20 w-auto object-contain object-left" />}
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
                            <Button id="primaryColor" type="button" variant="outline" className="justify-start gap-3 bg-white text-slate-700">
                              <span aria-hidden="true" className="h-5 w-5 rounded border border-slate-200" style={{ backgroundColor: field.value || '#fff' }} />
                              {field.value || "Select color"}
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
                            <Button id="secondaryColor" type="button" variant="outline" className="justify-start gap-3 bg-white text-slate-700">
                              <span aria-hidden="true" className="h-5 w-5 rounded border border-slate-200" style={{ backgroundColor: field.value || '#fff' }} />
                              {field.value || "Select color"}
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
                  <CardTitle className="text-base font-bold leading-6 text-slate-900">Integration security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Payment integration is not configured. Never enter API keys here; store credentials in your hosting provider&apos;s secret settings.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold leading-6 text-slate-900">Content Management Defaults</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="defaultPostStatus" className="text-sm font-medium text-foreground">Default Post Status</label>
                    <Controller
                      name="defaultPostStatus"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <SelectTrigger id="defaultPostStatus" className="border-input bg-background">
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
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <SelectTrigger id="commentModeration" className="border-input bg-background">
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
                  <CardTitle className="text-base font-bold leading-6 text-slate-900">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Reviews always require admin approval. Account protection also depends on strong passwords, multi-factor access controls, and your hosting security configuration.</p>
                </CardContent>
              </Card>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save All Settings'}
              </Button>
            </form>}
          </Content>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;