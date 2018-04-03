<?php
/**
 * User服务层
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2018/4/2
 * Time: 13:12
 */

namespace Home\Service;

use Think\Exception;
use Think\Model;

//改变时区为北京
date_default_timezone_set('prc');

class UserService extends Model
{
    /**
     * 通过用户id获取用户信息
     * @param $id 用户id
     * @return array
     */
    public function getUserInfo($id)
    {

        $Model = new \Think\Model();
        $msg = null; //返回消息
        $result = null; //查询结果
        $User = null; //User信息
        $Pic = null; //Pic信息
        $status = null; //传递状态 0失败 1 成功
        if (isset($id)) {
            try {
                //sql查询
                $condition['u.id'] = 'p.uid';
                $condition['u.id'] = $id;
                $condition['_logic'] = 'and';
                $result = $Model->table(array('user' => 'u', 'pic' => p))->where($condition)->select();
            } catch (Exception $e) {
                $msg = 'Service错误，sql语句异常./r' . $e->getMessage();
            }
            $User = D('User')->create($result);
            $Pic = D('Pic')->create($result);
            $msg = 'success';
        } else {
            $msg = 'Service错误，id未设置';
        }

        if ($msg == 'success') {
            $status = 1;
        } else {
            $status = 0;
        }

        $rtnData = array(
            'statu' => $status,
            'msg' => $msg,
            'User' => $User,
            'Pic' => $Pic
        );

        return $rtnData;
    }

    /**
     * 用户登录
     * @param $user 用户模型类 包含账号 和 密码
     */
    public function userLogin($user)
    {
        //验证登录信息
        $account = null;
        $pwd = null;

        if (isset($user['account'])) {
            $account = $user['account'];
        } else {
            return array('msg' => '请输入账号', 'status' => 0);
        }

        if (isset($user['pwd'])) {
            //md5加密密码
            $pwd = md5($user['pwd']);
        } else {
            return array('msg' => '请输入密码', 'status' => 0);
        }

        $UserM = M('User');
        $condition['account'] = $account;
        $condition['pwd'] = $pwd;
        if ($UserM->where($condition)->count() > 0) {
            //通过id获取用户信息
            $Uid = $UserM->where($condition)->getField('id');
            $UserData = $this->getUserInfo($Uid[0]);
            //写入session
            $_SESSION['userid'] = $UserData['id'];
            $_SESSION['username'] = $UserData['name'];

            //返回成功
            return array('msg' => '登录成功', 'status' => 1);
        } else {
            return array('msg' => '账户或密码错误', 'status' => 0);
        }
    }

    /**
     * 用户注册
     * @param $user 用户模型类
     * @param $testcode 测试码模型类
     */
    public function userRegister($user, $testcode, $repwd)
    {
        $msg = "success";
        $status = 1;
        $UserM = M('User');
        $TestcodeM = M('testcode');

        //验证注册信息
        if (isset($user['account']) && isset($user['pwd']) && isset($user['name']) && isset($repwd) && isset($testcode)) {
            //验证testcode
            unset($condition);
            $condition['code'] = $testcode;
            $condition['_string'] = 'maxnum > nownum';
            //如果testcode通过
            if (($TestcodeM->where($condition)->count()) > 0) {

                unset($condition);
                $condition['account'] = $user['account'];
                //验证账号是否存在
                if (($UserM->where($condition)->count()) > 0) {
                    $msg = '账号已存在';
                    $status = 0;
                } else {
                    unset($condition);
                    $condition['name'] = $user['name'];
                    //验证名称是否存在
                    if (($UserM->where($condition)->count()) > 0) {
                        $msg = '用户名已被注册';
                        $status = 0;
                    } else {
                        //验证两次密码
                        if ($repwd == $user['pwd']) {
                            $user['pwd'] = md5($user['pwd']);
                            $user['createtime'] = date("Y-m-d G:i:s");
                            //保存
                            $UserM->field('name,pwd,account,createtime')->data($user)->add();
                            //邀请码加一
                            unset($condition);
                            $condition['code'] = $testcode;
                            $TestcodeM->where($condition)->setInc('nownum', 1);
                        } else {
                            $msg = '重复密码不正确';
                            $status = 0;
                        }
                    }
                }

            } else {
                $status = 0;
                $msg = "邀请码错误";
            }

        } else {
            $status = 0;
            $msg = "请将信息填写完整";
        }

        //信息是否填写完整
        if ($infoFlag == 0) {
            $status = 0;
            $msg = "请将信息填写完整";
        }

        return array(
            'msg' => $msg,
            'status' => $status
        );


    }

    /**
     * 单独的验证账号是否存在
     * @param $user 用户模型类
     */
    public function userAccountExist($user)
    {
        $UserM = M('User');
        //验证是否传值
        if (isset($user['account'])) {
            $condition['account'] = $user['account'];
            if (($UserM->where($condition)->count()) > 0) {
                return array('msg' => '账号已经被注册', 'status' => '0');
            } else {
                return array('msg' => '账号可以用', 'status' => '1');
            }

        } else {
            return array('msg' => '请输入账号', 'status' => '0');
        }
    }

    /**
     * 单独的验证名字是否存在
     * @param $user 用户模型类
     */
    public function userNameExist($user)
    {
        $UserM = M('User');
        //验证是否传值
        if (isset($user['name'])) {
            $condition['name'] = $user['name'];
            if (($UserM->where($condition)->count()) > 0) {
                return array('msg' => '名称已经被使用', 'status' => '0');
            } else {
                return array('msg' => '该名称可用', 'status' => '1');
            }

        } else {
            return array('msg' => '请输入名称', 'status' => '0');
        }
    }


    /**
     * 用户注销
     */
    public function userCancel()
    {
        unset($_SESSION['userid']);
        unset($_SESSION['username']);
        return array('status' => 1, 'msg' => 'success');
    }

    /**
     * 通过session获取用户信息
     */
    public function getUserInfoBySession()
    {
        $UserData = $this->getUserInfo($_SESSION['userid']);

        return $UserData;
    }

    /**
     * 修改用户信息
     * @param $user 用户模型类
     */
    public function alterUserInfo($user) {
        $UserM = M('User');
        $UserM->data($user)->save();
    }

}