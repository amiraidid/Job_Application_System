import { Module } from '@nestjs/common';
import { JobPostModule } from './presentation/modules/job-post.module';
import { ApplicationJobModule } from './presentation/modules/application-job.module';
import { InterviewModule } from './presentation/modules/interview.module';
import { UserModule } from './presentation/modules/user.module';
import { CommentModule } from './presentation/modules/comment.module';
import { CompanyModule } from './presentation/modules/company.module';
import { CompanyUsersModule } from './presentation/modules/company-users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './presentation/modules/notifications.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './presentation/http/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UserModule,
    JobPostModule,
    ApplicationJobModule,
    InterviewModule,
    CommentModule,
    CompanyModule,
    CompanyUsersModule,
    NotificationModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
