/** Node-side scripts only. Next loads .env.local itself; drizzle-kit and
 *  tsx scripts do not, so they import this first. */
import { config } from 'dotenv';
config({ path: '.env.local', quiet: true });
config({ quiet: true });
