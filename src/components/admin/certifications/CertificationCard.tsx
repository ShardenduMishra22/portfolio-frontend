import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Edit, Trash2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Certification } from '@/data/types.data'

type CertificationCardProps = {
  cert: Certification
  onEdit: (cert: Certification) => void
  onDelete: (certId: string) => void
}

export function CertificationCard({ cert, onEdit, onDelete }: CertificationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{cert.title}</CardTitle>
            <CardDescription className="mt-2">
              {cert.issuer} &mdash; {cert.issue_date} to {cert.expiry_date}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(cert)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(cert.inline.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {cert.skills.map((skill, idx) => (
            <Badge key={idx} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{cert.description}</p>
        <div className="flex space-x-2">
          {cert.certificate_url && (
            <a
              href={cert.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {cert.images && cert.images.length > 0 && cert.images[0] && (
            <div className="relative h-8 w-8">
              <Image
                src={cert.images[0]}
                alt={cert.title + ' certificate image'}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
