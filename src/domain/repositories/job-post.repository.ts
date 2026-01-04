import { JobPost } from '../entities/job-post.entity';

export interface IJobPostRepository {
  CreateJobPost(job: JobPost): Promise<JobPost>;
  UpdateJobPost(job: JobPost, id: string): Promise<JobPost>;
  FindByIdPost(id: string, tenantId: string): Promise<JobPost>;
  FetchJobPosts(tenantId: string): Promise<JobPost[]>;
  PublishJobPost(id: string, tenantId: string): Promise<JobPost>;
  UnPublishJobPost(id: string, tenantId: string): Promise<JobPost>;
  RemoveJobPost(id: string, tenantId: string): Promise<JobPost>;
}

export const JOB_REPOSITRY = Symbol('JOB_REPOSITRY');
