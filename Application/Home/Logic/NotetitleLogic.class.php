<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2018/5/4
 * Time: 14:04
 */
namespace Home\Logic;

use Think\Model;

class NotetitleLogic extends Model
{

    /**
     * 保存笔记名
     * @param $notetitle 笔记名对象
     * @return mixed id
     */
    public function dailyAdd($notetitle) {
        $id = $notetitle->add();
        return $id;
    }

    /**
     * 获取笔记名列表 根据uid
     * @param $uid
     * @return mixed
     */
    public function getdailyList($uid){
        $condition['uid'] = $uid;
        $result = M('notetitle')->where($condition)->select();

        return $result;
    }

}