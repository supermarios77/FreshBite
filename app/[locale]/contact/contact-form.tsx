"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // For now, just log the form data
      // In production, you would send this to an API endpoint
      console.log("Contact form submission:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        type: "success",
        message: t("successMessage"),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || t("errorMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-normal text-foreground tracking-widest uppercase mb-2"
        >
          {t("formName")} *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-foreground transition-all text-sm tracking-wide"
          placeholder={t("formNamePlaceholder")}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-normal text-foreground tracking-widest uppercase mb-2"
        >
          {t("formEmail")} *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-foreground transition-all text-sm tracking-wide"
          placeholder={t("formEmailPlaceholder")}
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-normal text-foreground tracking-widest uppercase mb-2"
        >
          {t("formPhone")}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-foreground transition-all text-sm tracking-wide"
          placeholder={t("formPhonePlaceholder")}
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-xs font-normal text-foreground tracking-widest uppercase mb-2"
        >
          {t("formSubject")} *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-foreground transition-all text-sm tracking-wide"
          placeholder={t("formSubjectPlaceholder")}
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-xs font-normal text-foreground tracking-widest uppercase mb-2"
        >
          {t("formMessage")} *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full px-4 py-3 border-2 border-foreground bg-background text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-foreground transition-all text-sm tracking-wide resize-none"
          placeholder={t("formMessagePlaceholder")}
        />
      </div>

      {/* Submit Status */}
      {submitStatus.type && (
        <div
          className={`p-4 border-2 ${
            submitStatus.type === "success"
              ? "border-accent bg-accent/20 text-foreground"
              : "border-destructive bg-destructive/20 text-destructive"
          }`}
        >
          <p className="text-sm tracking-wide">{submitStatus.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="accent"
        disabled={isSubmitting}
        className="w-full text-xs px-8 py-3 tracking-widest uppercase rounded-none"
      >
        {isSubmitting ? t("sending") : t("sendButton")}
      </Button>
    </form>
  );
}

