<?php

namespace Home\Controller;

use Think\Controller;

class IndexController extends Controller
{
    public function index()
    {
        $UserService = D('User',"Service");
        $result = $UserService->getUserInfo(1);
        print_r($result);
        //$this->display();
    }

    public function login()
    {
        $this->display();
    }
}