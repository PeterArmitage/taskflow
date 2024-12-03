// types/helpers.ts

/**
 * Type helper for converting between null and undefined in different contexts
 * Useful when working with APIs that expect null but UI components that work with undefined
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

/**
 * Converts a value that might be undefined to a value that might be null
 * Useful when sending data to APIs that expect null for missing values
 */
export function toNullable<T>(value: Optional<T>): Nullable<T> {
	return value === undefined ? null : value;
}

/**
 * Converts a value that might be null to a value that might be undefined
 * Useful when receiving API data and passing it to UI components
 */
export function toOptional<T>(value: Nullable<T>): Optional<T> {
	return value === null ? undefined : value;
}

/**
 * Helper type for working with dates specifically
 * Includes methods for handling date conversions and formatting
 */
export class DateHelper {
	/**
	 * Converts a potentially null/undefined ISO date string to a Date object
	 * Returns undefined if the input is null/undefined/invalid
	 */
	static toDate(
		isoString: Nullable<string> | Optional<string>
	): Optional<Date> {
		if (!isoString) return undefined;
		const date = new Date(isoString);
		return isNaN(date.getTime()) ? undefined : date;
	}

	/**
	 * Converts a Date object to an ISO string for API submission
	 * Returns null for undefined dates (API friendly)
	 */
	static toISOString(date: Optional<Date>): Nullable<string> {
		return date?.toISOString() ?? null;
	}
}

// Type guards for type checking
export function isNullOrUndefined<T>(
	value: Nullable<T> | Optional<T>
): value is null | undefined {
	return value === null || value === undefined;
}

export function hasValue<T>(value: Nullable<T> | Optional<T>): value is T {
	return !isNullOrUndefined(value);
}
