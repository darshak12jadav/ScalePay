import { AnalyticsRepository } from './repositories/analytics.repository.js';
import { AnalyticsService } from './services/analytics.service.js';

const analyticsRepository = new AnalyticsRepository();
export const analyticsService = new AnalyticsService(analyticsRepository);
