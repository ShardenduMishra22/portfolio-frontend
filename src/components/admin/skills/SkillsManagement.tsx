import { Card, CardContent } from '../../ui/card';
import React from 'react';

type SkillsManagementProps = {
  skills: string[];
};

export function SkillsManagement({ skills }: SkillsManagementProps) {
  return (
    <div className="py-10">
    <Card>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <span className="font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
</div>
  );
}
