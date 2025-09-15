"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Role options for autocomplete
const ROLE_OPTIONS = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer",
  "Senior Software Engineer", "Lead Software Engineer", "Principal Software Engineer",
  "React Developer", "Vue.js Developer", "Angular Developer", "Node.js Developer",
  "Python Developer", "Java Developer", "C# Developer", "PHP Developer",
  "Mobile Developer", "React Native Developer", "Flutter Developer", "iOS Developer", "Android Developer",
  "DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Platform Engineer",
  "Data Scientist", "Data Engineer", "Data Analyst", "Machine Learning Engineer", "AI Engineer",
  "Product Manager", "Technical Product Manager", "Project Manager", "Scrum Master",
  "UI/UX Designer", "Product Designer", "Graphic Designer", "Web Designer",
  "QA Engineer", "Test Engineer", "Automation Engineer", "Security Engineer",
  "Database Administrator", "System Administrator", "Network Engineer",
  "Technical Lead", "Engineering Manager", "CTO", "VP of Engineering"
];

// Tech stack options for autocomplete
const TECH_STACK_OPTIONS = [
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Node.js", "Express.js", "Fastify",
  "TypeScript", "JavaScript", "Python", "Java", "C#", "PHP", "Go", "Rust", "Ruby",
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase", "Supabase",
  "AWS", "Azure", "GCP", "Vercel", "Netlify", "Heroku", "DigitalOcean",
  "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "Bitbucket",
  "HTML5", "CSS3", "Sass", "SCSS", "Less", "Tailwind CSS", "Bootstrap", "Material UI",
  "Redux", "Zustand", "Context API", "GraphQL", "REST API", "tRPC",
  "Jest", "Vitest", "Cypress", "Playwright", "Testing Library",
  "Webpack", "Vite", "Rollup", "Babel", "ESLint", "Prettier",
  "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
  "Spring Boot", "Django", "Flask", "Laravel", "Ruby on Rails", "ASP.NET",
  "React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Unity",
  "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn", "OpenCV",
  "Electron", "Tauri", "PWA", "WebAssembly", "Three.js", "D3.js"
];

const interviewFormSchema = z.object({
  role: z.string().min(1, "Role is required"),
  level: z.enum(["Junior", "Mid", "Senior"], {
    required_error: "Please select a level",
  }),
  type: z.enum(["Technical", "Behavioral", "Mixed"], {
    required_error: "Please select interview type",
  }),
  techstack: z.string().min(1, "Tech stack is required"),
  amount: z.number().min(1).max(10, "Maximum 10 questions allowed"),
});

interface InterviewFormProps {
  userName: string;
  userId: string;
}

const InterviewForm = ({ userName, userId }: InterviewFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Role autocomplete states
  const [roleInput, setRoleInput] = useState("");
  const [roleSuggestions, setRoleSuggestions] = useState<string[]>([]);
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const roleSuggestionsRef = useRef<HTMLDivElement>(null);
  
  // Tech stack states
  const [techInput, setTechInput] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [techSuggestions, setTechSuggestions] = useState<string[]>([]);
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
  const techInputRef = useRef<HTMLInputElement>(null);
  const techSuggestionsRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof interviewFormSchema>>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      role: "",
      level: "Mid",
      type: "Mixed",
      techstack: "",
      amount: 5,
    },
  });

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Role suggestions
      if (
        roleSuggestionsRef.current &&
        !roleSuggestionsRef.current.contains(event.target as Node) &&
        !roleInputRef.current?.contains(event.target as Node)
      ) {
        setShowRoleSuggestions(false);
      }
      
      // Tech suggestions
      if (
        techSuggestionsRef.current &&
        !techSuggestionsRef.current.contains(event.target as Node) &&
        !techInputRef.current?.contains(event.target as Node)
      ) {
        setShowTechSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update form value when selected techs change
  useEffect(() => {
    const techStackString = selectedTechs.join(", ");
    form.setValue("techstack", techStackString);
  }, [selectedTechs, form]);

  // Role input handlers
  const handleRoleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoleInput(value);
    form.setValue("role", value);

    if (value.trim()) {
      const filtered = ROLE_OPTIONS.filter((role) =>
        role.toLowerCase().includes(value.toLowerCase())
      );
      setRoleSuggestions(filtered);
      setShowRoleSuggestions(true);
    } else {
      setShowRoleSuggestions(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    setRoleInput(role);
    form.setValue("role", role);
    setShowRoleSuggestions(false);
  };

  const handleRoleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && roleSuggestions.length > 0) {
      e.preventDefault();
      handleRoleSelect(roleSuggestions[0]);
    }
  };

  // Tech stack handlers
  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechInput(value);

    if (value.trim()) {
      const filtered = TECH_STACK_OPTIONS.filter(
        (tech) =>
          tech.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTechs.includes(tech)
      );
      setTechSuggestions(filtered);
      setShowTechSuggestions(true);
    } else {
      setShowTechSuggestions(false);
    }
  };

  const handleTechSelect = (tech: string) => {
    if (!selectedTechs.includes(tech)) {
      setSelectedTechs([...selectedTechs, tech]);
    }
    setTechInput("");
    setShowTechSuggestions(false);
    techInputRef.current?.focus();
  };

  const handleTechRemove = (techToRemove: string) => {
    setSelectedTechs(selectedTechs.filter((tech) => tech !== techToRemove));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (techSuggestions.length > 0) {
        handleTechSelect(techSuggestions[0]);
      } else if (techInput.trim() && !selectedTechs.includes(techInput.trim())) {
        handleTechSelect(techInput.trim());
      }
    }

    if (e.key === "Backspace" && !techInput && selectedTechs.length > 0) {
      handleTechRemove(selectedTechs[selectedTechs.length - 1]);
    }
  };

  const onSubmit = async (data: z.infer<typeof interviewFormSchema>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userid: userId,
        }),
      });

      const result = await response.json();

      if (result.success && result.interviewId) {
        toast.success("Interview created successfully!");
        router.push(`/interview/${result.interviewId}`);
      } else {
        toast.error(result.message || "Failed to create interview. Please try again.");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="card-border w-full">
        <div className="flex flex-col gap-6 card py-6 px-8">
          <div className="text-center">
            <h2>Create New Interview</h2>
            <p className="text-light-400 mt-2">
              Fill in the details to generate your personalized interview questions
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 form"
            >
              {/* First Row: Role and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Role with Autocomplete */}
                <div className="relative">
                  <label className="label">Job Role</label>
                  <input
                    ref={roleInputRef}
                    type="text"
                    value={roleInput}
                    onChange={handleRoleInputChange}
                    onKeyDown={handleRoleKeyDown}
                    onFocus={() => roleInput && setShowRoleSuggestions(true)}
                    className="input w-full"
                    placeholder="Start typing your role (e.g., Frontend Developer)"
                  />

                  {/* Role Suggestions Dropdown */}
                  {showRoleSuggestions && roleSuggestions.length > 0 && (
                    <div
                      ref={roleSuggestionsRef}
                      className="absolute top-full left-0 right-0 bg-dark-200 border border-input rounded-md mt-1 max-h-48 overflow-y-auto z-10 shadow-lg"
                    >
                      {roleSuggestions.slice(0, 10).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className="w-full text-left px-4 py-2 hover:bg-dark-300 text-light-100 transition-colors"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <label className="label">Experience Level</label>
                  <div className="relative">
                    <select
                      {...form.register("level")}
                      className="input w-full appearance-none pr-10"
                    >
                      <option value="Junior">Junior Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Second Row: Interview Type and Question Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interview Type */}
                <div>
                  <label className="label">Interview Type</label>
                  <div className="relative">
                    <select
                      {...form.register("type")}
                      className="input w-full appearance-none pr-10"
                    >
                      <option value="Technical">Technical Focus</option>
                      <option value="Behavioral">Behavioral Focus</option>
                      <option value="Mixed">Mixed (Balanced)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-light-400 pointer-events-none" />
                  </div>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="label">Number of Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...form.register("amount", { valueAsNumber: true })}
                    className="input w-full"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Third Row: Tech Stack (Full Width) */}
              <div className="relative">
                <label className="label">Tech Stack</label>
                
                {/* Selected Technologies */}
                {selectedTechs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 p-3 bg-dark-300/50 rounded-lg">
                    {selectedTechs.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-2 bg-primary-200/20 text-primary-200 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleTechRemove(tech)}
                          className="hover:bg-primary-200/30 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Input Field */}
                <input
                  ref={techInputRef}
                  type="text"
                  value={techInput}
                  onChange={handleTechInputChange}
                  onKeyDown={handleTechKeyDown}
                  onFocus={() => techInput && setShowTechSuggestions(true)}
                  className="input w-full"
                  placeholder={selectedTechs.length === 0 ? "Start typing to add technologies (e.g., React, Node.js, Python)" : "Add more technologies..."}
                />

                {/* Tech Suggestions Dropdown */}
                {showTechSuggestions && techSuggestions.length > 0 && (
                  <div
                    ref={techSuggestionsRef}
                    className="absolute top-full left-0 right-0 bg-dark-200 border border-input rounded-md mt-1 max-h-48 overflow-y-auto z-10 shadow-lg"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                      {techSuggestions.slice(0, 12).map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => handleTechSelect(tech)}
                          className="text-left px-4 py-2 hover:bg-dark-300 text-light-100 transition-colors border-r border-b border-input/20 last:border-r-0"
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hidden input for form validation */}
                <input
                  type="hidden"
                  {...form.register("techstack")}
                />
                
                <p className="text-xs text-light-400 mt-2">
                  Type to search and select technologies. Press Enter to add custom ones. Use tags above to remove selected items.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  className="btn w-full h-12 text-base" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Interview..." : "Create Interview"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;