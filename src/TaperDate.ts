export class TaperDate {
	private date: Date;

	constructor(input?: string | Date) {
		if (typeof input === 'string') {
			this.date = this.parseYYYYMMDD(input);
		} else if (input instanceof Date) {
			this.date = new Date(
				Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate())
			);
		} else {
			const now = new Date();
			this.date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
		}
		this.setTo24thHour();
	}

	private parseYYYYMMDD(yyyymmdd: string): Date {
		const [year, month, day] = yyyymmdd.split('-').map((part) => parseInt(part, 10));
		return new Date(Date.UTC(year, month - 1, day)); // Months are 0-based in JavaScript Date
	}

	private setTo24thHour(): void {
		this.date.setUTCHours(12, 0, 0, 0); // 24th hour is effectively the next day at 00:00:00.000 UTC
	}

	public incrementByOneDay() {
		this.date.setUTCDate(this.date.getUTCDate() + 1);
		this.setTo24thHour();
		return this;
	}

	public incrementByDays(days: number): this {
		this.date.setUTCDate(this.date.getUTCDate() + days);
		this.setTo24thHour();
		return this;
	}

	public setDate(input: string | Date) {
		if (typeof input === 'string') {
			this.date = this.parseYYYYMMDD(input);
		} else if (input instanceof Date) {
			this.date = new Date(
				Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate())
			);
		} else {
			throw new Error('Invalid input type. Expected string or Date.');
		}
		this.setTo24thHour();
		return this;
	}

	public toYYYYMMDD(): InputStringDate {
		const year = this.date.getUTCFullYear();
		const month = (this.date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JavaScript Date
		const day = this.date.getUTCDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}` as InputStringDate;
	}

	public toScheduleDate(): ScheduleDate {
		return new Date(this.date) as ScheduleDate;
	}
}
