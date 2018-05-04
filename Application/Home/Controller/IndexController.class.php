<?php
/**
 * 首页控制器
 * User: 郭 奡
 * Date: 2018/4/9
 * Time: 10:12
 */

namespace Home\Controller;

use Think\Controller;
use Think\Exception;

class IndexController extends Controller
{
    /**
     * 上传说说
     */
    public function uploadShuoShuo()
    {
        if (IS_AJAX) {
            $DailyM = M('daily');
            $DailyM->create();
            $DailyM->typeid = 1;
            $DailyM->createtime = date("Y-m-d H:i:s", time());
            //获取用户id
            $DailyM->uid = $_SESSION['userid'];
            if (!empty($_FILES)) {
                try {
                    $upload = new \Think\Upload();
                    $upload->maxSize = 3145728; //文件上传的大小限制
                    $upload->exts = array('jpg', 'gif', 'png', 'jpeg'); //上传文件后缀的样式
                    $upload->rootPath = './Uploads/shuoshuo-img/';   //上传文件根目录
                    $upload->saveName = 'com_create_guid'; //GUID保存文件名字

                    $fileSavePath = array();
                    $fileUploadsSuccess = true;
                    $fileMsg = '';

                    foreach ($_FILES as $val) {
                        $fileinfo = $upload->uploadOne($val);
                        if (!$fileinfo) {// 上传错误提示错误信息
                            $fileUploadsSuccess = false;
                            $fileMsg .= ($val['name'] . ":" . $upload->getError() . ";");
                        } else {// 上传成功
                            array_push($fileSavePath, $upload->rootPath . $fileinfo["savepath"] . $fileinfo["savename"]);
                        }
                    }

                    if (!$fileUploadsSuccess) {
                        //删除图片
                        foreach ($fileSavePath as $path) {
                            unlink($path);
                        }
                        $result = array(
                            'msg' => $fileMsg,
                            'status' => '0'
                        );
                        $this->ajaxReturn($result);
                    }

                    $fileUploadsIds = array();
                    $picLogic = D('Pic', 'Logic');
                    //储存图片
                    foreach ($fileSavePath as $path) {
                        $pic = M('pic');
                        $pic->createtime = date("Y-m-d H:i:s", time());
                        //1 daily 2 头像 3背景
                        $pic->type = 1;
                        $pic->picpath = $path;
                        $id = $picLogic->savePic($pic);
                        array_push($fileUploadsIds, $id);
                    }

                    $DailyM->picids = implode(',', $fileUploadsIds);
                } catch (Exception $e) {
                    $result = array(
                        'msg' => $e->getMessage(),
                        'status' => '0'
                    );
                    $this->ajaxReturn($result);
                }


            }

            try {
                //保存说说数据
                $dailyLogic = D('Daily', 'Logic');
                $dailyId = $dailyLogic->dailySave($DailyM);
                if ($dailyId) {
                    $result = array(
                        'msg' => '说说发布成功！',
                        'status' => '1'
                    );
                    $this->ajaxReturn($result);
                } else {
                    $result = array(
                        'msg' => '说说发布失败',
                        'status' => '0'
                    );
                    $this->ajaxReturn($result);
                }

            } catch (Exception $e) {
                $result = array(
                    'msg' => $e->getMessage(),
                    'status' => '0'
                );
                $this->ajaxReturn($result);
            }
        }
    }


}