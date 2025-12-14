CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`location` varchar(100) NOT NULL,
	`courseType` varchar(100) NOT NULL,
	`courseLevel` varchar(50) NOT NULL,
	`specificCourse` varchar(100) NOT NULL,
	`parentName` varchar(100),
	`parentPhone` varchar(20),
	`previousExperience` text,
	`startDate` varchar(50) NOT NULL,
	`enrollmentDate` timestamp NOT NULL DEFAULT (now()),
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`notes` text,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
