import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { insertSubscriptionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const subscriptionSchema = insertSubscriptionSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  acceptedPolicy: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy to subscribe",
  }),
});

const NewsletterForm = () => {
  const { toast } = useToast();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: "",
      acceptedPolicy: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof subscriptionSchema>) => {
      const response = await apiRequest("POST", "/api/subscribe", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully subscribed to our newsletter.",
        variant: "default",
      });
      form.reset();
      setIsSubmitSuccessful(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof subscriptionSchema>) => {
    mutate(data);
  };

  return (
    <div className="py-16 bg-gradient-to-r from-primary-950 to-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat opacity-30" style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0id2hpdGUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9zdmc+')"}}></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-sans mb-4">Stay <span className="text-primary">Connected</span></h2>
          <p className="text-neutral-200 mb-8">
            Subscribe to our newsletter to receive the latest gaming news, exclusive deals, and early access to reviews.
          </p>
          
          {isSubmitSuccessful ? (
            <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
              <h3 className="text-xl font-bold text-accent mb-2">Thank You for Subscribing!</h3>
              <p className="text-neutral-200">
                You're now part of the GamePulse community. We'll keep you updated with the latest gaming news and exclusive content.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input 
                            placeholder="Enter your email address" 
                            className="bg-primary-800 text-white border-primary-700 h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-white font-medium h-12"
                    disabled={isPending}
                  >
                    {isPending ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <FormField
                    control={form.control}
                    name="acceptedPolicy"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="leading-none">
                          I agree to receive emails and accept the <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterForm;
