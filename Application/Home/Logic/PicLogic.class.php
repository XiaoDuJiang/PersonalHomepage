<?php
/**
 * Pic逻辑层
 * Created by PhpStorm.
 * User: 郭奡
 * Date: 2018/5/3
 * Time: 11:05
 */

namespace Home\Logic;

use Think\Model;

class PicLogic extends Model
{

    /**
     * 保存图片数据
     * @param $pic 图片对象
     * @return mixed 返回存放的id
     */
    public function savePic($pic)
    {
        $id = $pic->add();
        return $id;
    }


}
