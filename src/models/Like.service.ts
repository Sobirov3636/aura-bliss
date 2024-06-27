import LikeModel from "../schema/Like.model";

class LikeService {
  private readonly likeModel;

  constructor() {
    this.likeModel = LikeModel;
  }
}

export default LikeService;
