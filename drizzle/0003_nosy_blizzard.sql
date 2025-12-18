CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`attendanceDate` timestamp NOT NULL,
	`attended` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classCapacity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`day` varchar(20) NOT NULL,
	`time` varchar(10) NOT NULL,
	`location` varchar(100) NOT NULL,
	`courseType` varchar(100) NOT NULL,
	`maxCapacity` int NOT NULL DEFAULT 10,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classCapacity_id` PRIMARY KEY(`id`)
);
