import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MessageSquare, PhoneCall } from "lucide-react";

const schema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(20),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

export function InquiryForm({ carId, carTitle }: { carId: string; carTitle: string }) {
  const [intent, setIntent] = useState<"inquiry" | "callback" | "test_drive">("inquiry");
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormData) => {
    setSubmitting(true);
    const messagePrefix =
      intent === "callback" ? "[Callback Request] " :
      intent === "test_drive" ? "[Test Drive Request] " : "";
    const { error } = await supabase.from("customer_inquiries").insert({
      car_id: carId,
      customer_name: values.customer_name,
      email: values.email,
      phone: values.phone,
      city: values.city || null,
      message: (messagePrefix + (values.message ?? "")).trim() || `Interested in ${carTitle}`,
      inquiry_status: "New",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send your inquiry. Please try again.");
      return;
    }
    toast.success("Inquiry sent! Our team will reach out shortly.");
    reset();
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card-soft">
      <h3 className="font-serif text-xl font-semibold">Interested in this car?</h3>
      <p className="mt-1 text-sm text-muted-foreground">Fill the form and our team will contact you within hours.</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <IntentBtn active={intent === "inquiry"} onClick={() => setIntent("inquiry")} icon={<MessageSquare className="h-4 w-4" />}>Inquiry</IntentBtn>
        <IntentBtn active={intent === "callback"} onClick={() => setIntent("callback")} icon={<PhoneCall className="h-4 w-4" />}>Callback</IntentBtn>
        <IntentBtn active={intent === "test_drive"} onClick={() => setIntent("test_drive")} icon={<Calendar className="h-4 w-4" />}>Test Drive</IntentBtn>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3">
        <div>
          <Label htmlFor="cn">Full Name</Label>
          <Input id="cn" {...register("customer_name")} />
          {errors.customer_name && <p className="mt-1 text-xs text-destructive">{errors.customer_name.message}</p>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="em">Email</Label>
            <Input id="em" type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="ph">Phone</Label>
            <Input id="ph" {...register("phone")} />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} placeholder="Chennai" />
        </div>
        <div>
          <Label htmlFor="msg">Message</Label>
          <Textarea id="msg" rows={3} {...register("message")} placeholder={`I'm interested in ${carTitle}…`} />
        </div>
        <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full">
          {submitting ? "Sending…" : intent === "callback" ? "Request Callback" : intent === "test_drive" ? "Schedule Test Drive" : "Send Inquiry"}
        </Button>
      </form>
    </div>
  );
}

function IntentBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all ${active ? "border-primary bg-primary text-primary-foreground shadow-elegant" : "border-border hover:border-primary/50"}`}
    >
      {icon} {children}
    </button>
  );
}