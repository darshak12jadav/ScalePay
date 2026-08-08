import { AnalyticsRepository } from './repositories/analytics.repository';
import { AnalyticsService } from './services/analytics.service';

const analyticsRepository = new AnalyticsRepository();
export const analyticsService = new AnalyticsService(analyticsRepository);
