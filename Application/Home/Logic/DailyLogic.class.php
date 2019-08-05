<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2018/5/3
 * Time: 11:22
 */

namespace Home\Logic;

use Think\Db;
use Think\Model;

class DailyLogic extends Model
{

    /**
     * 保存随记
     * @param $daily 随记对象
     * @return mixed id
     */
    public function dailySave($daily)
    {
        $id = $daily->add();
        return $id;
    }

    /**
     * Note: 获取日志分页
     * User: GuoAo
     * DateTime: 2019/8/5 17:01
     * @param $page 页码
     * @param $page_num 显示数量
     * @return array
     */
    public function getDailyListByPage($page, $page_num)
    {
        $daily = M('Daily');
        $userLog = new UserLogic();
        $user_info = $userLog->getUserInfoBySession();
        if ($user_info['statu'] == 1) {
            $u_id = $user_info['data']['Data'][0]['id'];
        } else {
            return array('data' => $user_info['data'], 'statu' => 0);
        }
        $daily_list = $daily->where('uid', $u_id)->order('createtime desc')->page($page, $page_num)->select();
        //获取类型
        $dailyType = M('DailyType');
        $typeList = $dailyType->select();
        $type = array();
        foreach ($typeList as $value) {
            $type[$value['id']] = $value['typename'];
        }
        foreach ($daily_list as $key => $value) {
            $daily_list[$key]['type'] = $type[$daily_list[$key]['typeid']];
        }
        return array('data' => $daily_list, 'statu' => 1);
    }

}