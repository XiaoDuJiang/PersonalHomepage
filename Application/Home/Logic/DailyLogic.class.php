<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2018/5/3
 * Time: 11:22
 */

namespace Home\Logic;

use Think\Model;

class DailyLogic extends Model
{

    /**
     * 保存随记
     * @param $daily 随记对象
     * @return mixed id
     */
    public function dailySave($daily) {
        $id = $daily->add();
        return $id;
    }

}