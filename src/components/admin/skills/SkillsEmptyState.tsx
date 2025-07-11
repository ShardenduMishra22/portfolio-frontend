import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Settings, Plus } from 'lucide-react';
import React from 'react';

type SkillsEmptyStateProps = {
  onAdd: () => void;
};

export function SkillsEmptyState({ onAdd }: SkillsEmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No skills yet</h3>
        <p className="text-gray-500 mb-4">
          Get started by adding your technical skills and competencies.
        </p>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Skills
        </Button>
      </CardContent>
    </Card>
  );
}
