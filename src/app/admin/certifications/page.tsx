"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "../../../components/auth/protected-route";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { certificationsAPI, projectsAPI, skillsAPI } from "../../../util/apiResponse.util";
import {
  Certification,
  CreateCertificationRequest,
} from "../../../data/types.data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CertificationAddDialog } from '../../../components/admin/certifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Edit, Trash2, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const certificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  projects: z.array(z.string()),
  certificate_url: z.string().url('Must be a valid URL'),
  images: z.string().optional(),
  issue_date: z.string().min(1, 'Issue date is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
});

type CertificationFormData = z.infer<typeof certificationSchema>;

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [allProjects, setAllProjects] = useState<{ id: string; name: string }[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const limit = 4;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { skills: [], projects: [] },
  });

  const fetchCertifications = async () => {
    try {
      const response = await certificationsAPI.getAllCertifications();
      setCertifications(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Failed to fetch certifications");
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
    (async () => {
      const projectsRes = await projectsAPI.getAllProjects();
      setAllProjects(Array.isArray(projectsRes.data) ? projectsRes.data.map((p: any) => ({ id: p.inline.id, name: p.project_name })) : []);
      const skillsRes = await skillsAPI.getSkills();
      setAllSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
    })();
  }, []);

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
    </div>
  );
  if (error) return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <span className="text-4xl">😢</span>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading text-foreground">Oops! Something went wrong</h2>
        <p className="text-foreground text-lg">{error}</p>
      </div>
    </div>
  );

  const onSubmit = async (data: CertificationFormData) => {
    try {
      const certData: CreateCertificationRequest = {
        ...data,
        images: data.images ? data.images.split(',').map(img => img.trim()) : [],
      };
      if (editingCertification) {
        await certificationsAPI.updateCertification(editingCertification.inline.id, certData);
        setSuccess('Certification updated successfully');
      } else {
        await certificationsAPI.createCertification(certData);
        setSuccess('Certification created successfully');
      }
      setIsDialogOpen(false);
      setEditingCertification(null);
      reset({ skills: [], projects: [] });
      fetchCertifications();
    } catch {
      setError('Failed to save certification');
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingCertification(cert);
    reset({
      title: cert.title,
      description: cert.description,
      issuer: cert.issuer,
      skills: cert.skills,
      projects: cert.projects,
      certificate_url: cert.certificate_url,
      images: cert.images.join(', '),
      issue_date: cert.issue_date,
      expiry_date: cert.expiry_date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (certId: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      await certificationsAPI.deleteCertification(certId);
      setSuccess("Certification deleted successfully");
      fetchCertifications();
      if ((page - 1) * limit >= certifications.length - 1 && page > 1) setPage(page - 1);
    } catch {
      setError("Failed to delete certification");
    }
  };

  const openDialog = () => {
    setEditingCertification(null);
    reset();
    setIsDialogOpen(true);
  };

  const totalPages = Math.ceil(certifications.length / limit);
  const currentData = certifications.slice((page - 1) * limit, page * limit);

  return (
    <ProtectedRoute>
      <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 space-y-4">
          <h1 className="text-2xl md:text-3xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
            Certifications - Manage your certifications and professional achievements.
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 border-b border-border">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-1">Your Certifications</h2>
            <p className="text-foreground text-lg">Add, edit, or remove your certifications below.</p>
          </div>
          <CertificationAddDialog
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
            onSubmit={onSubmit}
            errors={errors}
            register={register}
            handleSubmit={handleSubmit}
            reset={reset}
            setValue={setValue}
            watch={watch}
            editingCertification={editingCertification}
            allSkills={allSkills}
            allProjects={allProjects}
            openDialog={openDialog}
          />
        </div>

        {success && (
          <Alert className="animate-fade-in">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {certifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <Award className="mx-auto h-16 w-16 text-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No certifications yet</h3>
            <p className="text-lg text-foreground mb-6">Get started by adding your first certification.</p>
            <Button onClick={openDialog} className="shadow-md hover:shadow-xl transition-all duration-200 flex items-center">
              <Award className="mr-2 h-5 w-5" /> Add Certification
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              {currentData.map((cert) => (
                <Card key={cert.inline?.id || cert.inline.id} className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl animate-fade-in flex flex-col max-w-full">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-card pb-1 px-4">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      {cert.title}
                    </CardTitle>
                    <CardDescription className="text-foreground text-sm">
                      {cert.issuer} &bull; {cert.issue_date} to {cert.expiry_date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-2 p-4">
                    <p className="text-sm text-foreground">
                      {cert.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cert.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(cert)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(cert.inline.id)} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
