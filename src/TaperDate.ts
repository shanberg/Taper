/**
 * @fileoverview TaperDate: converts string (YYYY-MM-DD), Date, or undefined to a UTC date at noon.
 * Used for schedule dates to avoid timezone-offset issues.
 */

/**
 * Asserts that the value is a string or Date; throws otherwise.
 * @param input - Value to check
 * @throws Error when input is not string or Date
 */
function assertStringOrDate(input: unknown): asserts input is string | Date {
	if (typeof input !== 'string' && !(input instanceof Date)) {
		throw new Error('Invalid input type. Expected string or Date.');
	}
}

/**
 * Converts string (YYYY-MM-DD), Date, or undefined to a UTC date for TaperDate normalization.
 * @param input - Optional YYYY-MM-DD string, Date, or undefined for today
 * @returns UTC Date; caller normalizes time to noon
 */
function inputToUTCDate(input?: string | Date): Date {
	if (typeof input === 'string') {
		const [year, month, day] = input.split('-').map((part) => parseInt(part, 10));
		return new Date(Date.UTC(year, month - 1, day)); // months 0-based in JS Date
	}
	if (input instanceof Date) {
		return new Date(
			Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate())
		);
	}
	const now = new Date();
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * UTC date held at noon to avoid timezone-offset issues.
 * Accepts YYYY-MM-DD strings or Date objects; always stores the date-only at 12:00 UTC.
 */
export class TaperDate {
	private date: Date;

	/**
	 * Create from YYYY-MM-DD string, Date, or today (if no argument).
	 * @param input - Optional YYYY-MM-DD string, Date, or undefined for today
	 * @returns New TaperDate instance at noon UTC
	 */
	constructor(input?: string | Date) {
		this.date = inputToUTCDate(input);
		this.setTo12thHour();
	}

	/**
	 * Normalize stored date to noon UTC to avoid timezone-offset issues.
	 * @returns void
	 */
	private setTo12thHour(): void {
		this.date.setUTCHours(12, 0, 0, 0);
	}

	/** Add one day in place; returns this for chaining. @returns this */
	public incrementByOneDay(): this {
		this.date.setUTCDate(this.date.getUTCDate() + 1);
		this.setTo12thHour();
		return this;
	}

	/**
	 * Add the given number of days in place; returns this for chaining.
	 * @param days - Number of days to add
	 * @returns this
	 */
	public incrementByDays(days: number): this {
		this.date.setUTCDate(this.date.getUTCDate() + days);
		this.setTo12thHour();
		return this;
	}

	/**
	 * Replace the stored date with the given string or Date. Throws if input is not string or Date.
	 * @param input - YYYY-MM-DD string or Date
	 * @returns this
	 */
	public setDate(input: string | Date): this {
		assertStringOrDate(input);
		this.date = inputToUTCDate(input);
		this.setTo12thHour();
		return this;
	}

	/** Format as YYYY-MM-DD. @returns Date string in YYYY-MM-DD form */
	public toYYYYMMDD(): InputStringDate {
		const year = this.date.getUTCFullYear();
		const month = (this.date.getUTCMonth() + 1).toString().padStart(2, '0');
		const day = this.date.getUTCDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}` as InputStringDate;
	}

	/** Return a Date copy suitable for use as ScheduleDate. @returns Date copy as ScheduleDate */
	public toScheduleDate(): ScheduleDate {
		return new Date(this.date) as ScheduleDate;
	}
}
