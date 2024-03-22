-- CreateTable
CREATE TABLE `QuestionContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `questionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestionContent` ADD CONSTRAINT `QuestionContent_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
