import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import React from 'react';

type SkillsOverviewProps = {
  skills: string[];
};

export function SkillsOverview({ skills }: SkillsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Overview</CardTitle>
        <CardDescription>
          You have {skills.length} skill{skills.length !== 1 ? 's' : ''} in your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
