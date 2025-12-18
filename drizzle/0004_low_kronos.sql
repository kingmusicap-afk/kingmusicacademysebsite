CREATE TABLE `classReminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`reminderDate` timestamp NOT NULL,
	`classDate` timestamp NOT NULL,
	`emailSent` int NOT NULL DEFAULT 0,
	`whatsappSent` int NOT NULL DEFAULT 0,
	`emailSentAt` timestamp,
	`whatsappSentAt` timestamp,
	`emailError` text,
	`whatsappError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classReminders_id` PRIMARY KEY(`id`)
);
