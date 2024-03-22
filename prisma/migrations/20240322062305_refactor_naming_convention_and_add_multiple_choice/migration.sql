/*
  Warnings:

  - You are about to drop the column `questionId` on the `QuestionContent` table. All the data in the column will be lost.
  - Added the required column `question_id` to the `QuestionContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `QuestionContent` DROP FOREIGN KEY `QuestionContent_questionId_fkey`;

-- AlterTable
ALTER TABLE `QuestionContent` DROP COLUMN `questionId`,
    ADD COLUMN `question_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `MultipleChoiceAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `correct` BOOLEAN NOT NULL DEFAULT false,
    `question_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestionContent` ADD CONSTRAINT `QuestionContent_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MultipleChoiceAnswer` ADD CONSTRAINT `MultipleChoiceAnswer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
