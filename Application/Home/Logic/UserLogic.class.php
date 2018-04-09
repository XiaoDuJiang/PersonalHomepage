<?php
/**
 * User逻辑层
 * Created by PhpStorm.
 * User: 郭奡
 * Date: 2018/4/2
 * Time: 13:10
 */

namespace Home\Logic;

use Think\Model;

class  UserLogic extends Model
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
        $Data = null; //返回数据
        $status = null; //传递状态 0失败 1 成功

        if (isset($id)) {
            try {
                //sql查询
                $condition['u.id'] = 'p.uid';
                $condition['u.id'] = $id;
                $condition['_logic'] = 'and';
                $Data = $Model->table(array('user' => 'u', 'pic' => p))->where($condition)->select();
            } catch (Exception $e) {
                $msg = 'Service错误，sql语句异常./r' . $e->getMessage();
                return array(
                    'msg' => $msg
                );
            }
            $msg = 'success';
        } else {
            $msg = '读取id错误';
        }

        if ($msg == 'success') {
            $status = 1;
        } else {
            $status = 0;
        }

        //剔除密码
        $Data[0]['password'] = "";

        $rtnData = array(
            'statu' => $status,
            'msg' => $msg,
            'Data' => $Data
        );

        return $rtnData;
    }

    /**
     * 用户登录
     * @param $user 用户模型类 包含账号 和 密码
     * @return array
     */
    public function userLogin($user)
    {
        //验证登录信息
        $account = null;
        $password = null;

        if (isset($user->account)) {
            $account = $user->account;
        } else {
            return array('msg' => '请输入账号', 'status' => 0);
        }

        if (isset($user->password)) {
            //md5加密密码
            $password = md5($user->password);
        } else {
            return array('msg' => '请输入密码', 'status' => 0);
        }

        $UserM = M('User');
        $condition['account'] = $account;
        $condition['password'] = $password;

        if ($UserM->where($condition)->count() > 0) {
            //通过id获取用户信息
            $Uid = $UserM->where($condition)->getField('id');

            $UserData = $this->getUserInfo($Uid[0]);
            //写入session
            $_SESSION['userid'] = $UserData['Data'][0]['id'];
            $_SESSION['username'] = $UserData['Data'][0]['username'];

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
     * @return array 状态 信息
     */
    public function userRegister($user, $testcode, $repwd)
    {
        $msg = "success";
        $status = 1;
        $UserM = M('User');
        $TestcodeM = M('testcode');

        //验证注册信息
        if (isset($user->account) && isset($user->password) && isset($user->username) && isset($repwd) && isset($testcode)) {
            //验证testcode
            unset($condition);
            $condition['code'] = $testcode;
            $condition['_string'] = 'maxnum > nownum';
            //如果testcode通过
            if (($TestcodeM->where($condition)->count()) > 0) {

                unset($condition);
                $condition['account'] = $user->account;
                //验证账号是否存在
                if (($UserM->where($condition)->count()) > 0) {
                    $msg = '账号已存在';
                    $status = 0;
                } else {
                    unset($condition);
                    $condition['username'] = $user->username;
                    //验证名称是否存在
                    if (($UserM->where($condition)->count()) > 0) {
                        $msg = '用户名已被注册';
                        $status = 0;
                    } else {
                        //验证两次密码
                        if ($repwd == $user->password) {
                            $user->password = md5($user->password);
                            //保存
                            $user->add();
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

        return array(
            'msg' => $msg,
            'status' => $status
        );
    }

    /**
     * 单独的验证账号是否存在
     * @param $user 用户模型类
     * @return array
     */
    public function userAccountExist($user)
    {
        $UserM = M('User');
        //验证是否传值
        if (isset($user->account)) {
            $condition['account'] = $user->account;
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
     * @return array
     */
    public function userNameExist($user)
    {
        $UserM = M('User');
        //验证是否传值
        if (isset($user->username)) {
            $condition['username'] = $user->username;
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
        try {
            unset($_SESSION['userid']);
            unset($_SESSION['username']);
            return array('status' => 1, 'msg' => 'success');
        } catch (Exception $e) {
            return array('status' => 0, 'msg' => 'error');
        }

    }

    /**
     * 通过session获取用户信息
     */
    public function getUserInfoBySession()
    {
        try {
            $UserData = $this->getUserInfo($_SESSION['userid']);
            return array('data' => $UserData, 'statu' => '1');
        } catch (Exception $e) {
            return array('data' => '获取失败', 'statu' => '0');
        }
    }

    /**
     * 修改用户信息
     * @param $user 用户模型类
     * @return array
     */
    public function alterUserInfo($user)
    {
        try {
            $UserM = M('User');
            $UserM->data($user)->save();
            return array('status' => '1');
        } catch (Exception $e) {
            return array('status' => '0');
        }
    }

}