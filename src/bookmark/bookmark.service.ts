import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {

    constructor(private prismaServie: PrismaService) {}

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = this.prismaServie.bookmark.create({
            data: {
                userId,
                ...dto
            }
        });

        return bookmark;
    }

    getBookmarks(userId: number) {
        return this.prismaServie.bookmark.findMany({ 
            where: {
                userId
            }
        });
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = this.prismaServie.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            },
        });
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        // get the bookmark by id
        const bookmark = await this.prismaServie.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resources denied');
        }

        return this.prismaServie.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto
            },
        });
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {

        const bookmark = await this.prismaServie.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resources denied');
        }

        await this.prismaServie.bookmark.delete({
            where: {
                id: bookmarkId
            }
        });
    }
}
