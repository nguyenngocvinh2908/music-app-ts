import { Request, Response } from 'express'
import Topic from '../../models/topic'
import slugify from 'slugify'

// [ GET ] "/admin/topics"
export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({ deleted: false })
  res.render('admin/pages/topics/index.pug', {
    titlePage: 'Topics Music Management',
    topics: topics
  })
}

// [ GET ] /admin/topics/create
export const create = async (req: Request, res: Response) => {
  res.render('admin/pages/topics/create.pug', {
    titlePage: 'Create Topic',
  });
};

// [ POST ] /admin/topics/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, avatar, description, status } = req.body as {
    title: string;
    avatar: string;
    description: string;
    status: string;
  };

  const newTopic = new Topic({
    title,
    avatar,
    description,
    status,
    slug: slugify(title, { lower: true, strict: true }),
  });

  await newTopic.save();

  res.redirect(`/${(req as any).prefixAdmin || 'admin'}/topics`);
};

// [GET] /admin/topics/edit/:idTopic
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idTopic } = req.params;

    const topic = await Topic.findOne({
      _id: idTopic,
      deleted: false,
    });

    if (!topic) {
      res.status(404).render('client/pages/errors/index.pug', {
        errorCode: 404,
        errorTitle: 'Không tìm thấy Topic',
        errorMessage: 'Topic này không tồn tại hoặc đã bị xoá.',
      });
      return;
    }

    res.render('admin/pages/topics/edit.pug', {
      titlePage: 'Edit Topic',
      topic: topic,
    });
  } catch (error) {
    // Rơi vào đây khi idTopic sai định dạng MongoDB (CastError)
    res.status(400).render('client/pages/errors/index.pug', {
      errorCode: 400,
      errorTitle: 'Đường dẫn không hợp lệ',
      errorMessage: 'ID của Topic không đúng định dạng.',
    });
  }
};

// [PATCH] /admin/topics/edit/:idTopic
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idTopic } = req.params;
    const { title, avatar, description, status } = req.body as {
      title: string;
      avatar: string;
      description: string;
      status: string;
    };

    await Topic.updateOne(
      { _id: idTopic },
      {
        title,
        avatar,
        description,
        status,
        slug: slugify(title, { lower: true, strict: true }),
      }
    );

    res.redirect(`/${(req as any).prefixAdmin || 'admin'}/topics`);
  } catch (error) {
    // Rơi vào đây khi update thất bại (id sai định dạng, hoặc lỗi DB)
    res.status(500).render('client/pages/errors/index.pug', {
      errorCode: 500,
      errorTitle: 'Cập nhật thất bại',
      errorMessage: 'Đã có lỗi xảy ra trong quá trình cập nhật, vui lòng thử lại.',
    });
  }
};