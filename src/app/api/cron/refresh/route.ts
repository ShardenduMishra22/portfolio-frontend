import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/util/redis';
import { certificationsAPI, experiencesAPI, projectsAPI, skillsAPI } from '@/util/apiResponse.util';


export async function GET(req: NextRequest) {
  const auth = req.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const [
      skills,
      projects,
      experiences,
      certifications
    ] = await Promise.all([
      skillsAPI.getSkills(),
      projectsAPI.getAllProjects(),
      experiencesAPI.getAllExperiences(),
      certificationsAPI.getAllCertifications(),
    ]);

    await Promise.all([
      redis.set('cache:skills', JSON.stringify(skills)),
      redis.set('cache:projects', JSON.stringify(projects)),
      redis.set('cache:experiences', JSON.stringify(experiences)),
      redis.set('cache:certifications', JSON.stringify(certifications)),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to refresh cache' }, { status: 500 });
  }
}
