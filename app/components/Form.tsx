"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const Form: React.FC = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    unlockDate: "",
    icloudEmail: "",
    icloudPassword: "",
    generatedCode: generateCode(),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      setSuccess(formData.generatedCode);

      // Optionally reset form:
      setFormData({
        unlockDate: "",
        icloudEmail: "",
        icloudPassword: "",
        generatedCode: generateCode(),
      });
    } catch (error: any) {
      setError(error.message);
      console.error("Error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!session?.user) {
    return "You have to be connected to access to this page.";
  }
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="gap-x-2">
        <label htmlFor="unlockDate">Unlock Date:</label>
        <Input
          type="datetime-local"
          id="unlockDate"
          name="unlockDate"
          value={formData.unlockDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="icloudEmail">iCloud Email:</label>
        <Input
          type="email"
          id="icloudEmail"
          name="icloudEmail"
          value={formData.icloudEmail}
          onChange={handleChange}
          required
        />

        <label htmlFor="icloudPassword">iCloud Password:</label>
        <Input
          type="password"
          id="icloudPassword"
          name="icloudPassword"
          value={formData.icloudPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={isSubmitting} className="w-[100%] my-3">
          {isSubmitting ? "Submitting..." : "Generate a code"}
        </Button>
      </form>

      {error && <p className="error-message">Error: {error}</p>}
      {success && (
        <p className="success-message">
          Your generated code is{" "}
          <span className="font-extrabold">{success}</span>.
        </p>
      )}
    </div>
  );
};

export default Form;
