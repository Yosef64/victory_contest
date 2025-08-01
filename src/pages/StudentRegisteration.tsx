"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { CheckCircle, X, XCircle } from "lucide-react";
import { studentRegister } from "../services/studentServices";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce
    .number()
    .int()
    .positive({ message: "Please enter a valid age." })
    .min(5, { message: "Student must be at least 5 years old." })
    .transform((val) => val),
  grade: z.string({ error: "Please select a grade." }),
  school: z
    .string()
    .min(3, { message: "School name must be at least 3 characters." }),
  paid: z.boolean().default(false),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  region: z.string({ error: "Please select a region." }),
  imgUrl: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  isSuspended: z.boolean().default(false),
  phoneNumber: z
    .string()
    .max(13, { message: "The phone number must not exceed 10" })
    .min(10, { message: "The phone number must be 10 or 12" }),
});

export default function RegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      age: 5,
      grade: "",
      school: "",
      paid: false,
      city: "Adama",
      region: "Oromia",
      imgUrl: "",
      isSuspended: false,
      phoneNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let message;
    let success;
    try {
      await studentRegister(values);
      message = "Registration Submitted!";
      success = true;
    } catch (error) {
      message = "Something went wrong";
      success = false;
    }
    toast(message, {
      icon: success ? <CheckCircle /> : <XCircle />,
      style: {
        backgroundColor: success ? "green" : "#f8d7da",
        color: success ? "white" : "#721c24",
      },
    });
  }

  return (
    <div className="bg-gray-50 min-h-screen sm:p-6 lg:p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Student Registration
          </CardTitle>
          <CardDescription>
            Fill out the form to register a new student. All fields marked with
            * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Grid layout for responsive design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Abebe Bikila" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Image URL Field */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+251" {...field} />
                      </FormControl>
                      <FormDescription>
                        Notice: The Number must be 12 digit and starts with +251
                        or 09|07
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age Field */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 14"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* School Field */}
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Adama High School"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Grade Field */}
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 4 }, (_, i) => (
                            <SelectItem key={i + 1} value={`${i + 1}`}>
                              Grade {9 + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City Field */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Adama" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Region Field */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Oromia">Oromia</SelectItem>
                          <SelectItem value="Amhara">Amhara</SelectItem>
                          <SelectItem value="Tigray">Tigray</SelectItem>
                          <SelectItem value="SNNPR">SNNPR</SelectItem>
                          <SelectItem value="Sidama">Sidama</SelectItem>
                          <SelectItem value="South West Ethiopia Peoples' Region">
                            South West Ethiopia Peoples' Region
                          </SelectItem>
                          <SelectItem value="Somali">Somali</SelectItem>
                          <SelectItem value="Afar">Afar</SelectItem>
                          <SelectItem value="Benishangul-Gumuz">
                            Benishangul-Gumuz
                          </SelectItem>
                          <SelectItem value="Gambela">Gambela</SelectItem>
                          <SelectItem value="Harari">Harari</SelectItem>
                          <SelectItem value="Addis Ababa">
                            Addis Ababa
                          </SelectItem>
                          <SelectItem value="Dire Dawa">Dire Dawa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg">
                  Register Student
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
