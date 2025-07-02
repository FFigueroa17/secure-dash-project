import { Skeleton } from '@/components/ui/skeleton';

const FormSkeleton = () => (
  <div className="w-full max-w-md space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" /> {/* Welcome Back title */}
      <Skeleton className="h-4 w-80" /> {/* Subtitle */}
    </div>

    {/* Form fields */}
    <div className="space-y-4">
      {/* Email field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
      </div>

      {/* Checkbox */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Divider text */}
      <div className="flex items-center justify-center">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Switch form link */}
      <div className="flex items-center justify-center space-x-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  </div>
);

const HealthCheckSkeleton = () => (
  <div className="flex items-center gap-2">
    <Skeleton className="h-2 w-2 rounded-full" />
    <Skeleton className="h-4 w-32" />
  </div>
);

const TestimonialCardSkeleton = () => (
  <div className="flex items-start gap-3 rounded-3xl bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64">
    <Skeleton className="h-10 w-10 rounded-2xl" /> {/* Avatar */}
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-24" /> {/* Name */}
      <Skeleton className="h-3 w-20" /> {/* Handle */}
      <div className="space-y-1">
        <Skeleton className="h-3 w-full" /> {/* Text line 1 */}
        <Skeleton className="h-3 w-full" /> {/* Text line 2 */}
        <Skeleton className="h-3 w-3/4" /> {/* Text line 3 */}
      </div>
    </div>
  </div>
);

const AuthPageSkeleton = () => {
  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      {/* Left column: auth forms */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 gap-4 relative">
        <FormSkeleton />
        <HealthCheckSkeleton />
      </section>

      {/* Right column: hero image + testimonials */}
      <section className="hidden lg:block flex-[1.6] relative p-4">
        {/* Hero image skeleton */}
        <Skeleton className="absolute inset-4 rounded-3xl" />

        {/* Testimonials skeleton */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
          <TestimonialCardSkeleton />
          <TestimonialCardSkeleton />
          <TestimonialCardSkeleton />
        </div>
      </section>
    </section>
  );
};

export default AuthPageSkeleton;
