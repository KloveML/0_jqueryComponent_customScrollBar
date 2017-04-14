/// <reference path="../typings/index.d.ts" />
/**
 * @version:1.0.0
 * @date:Tue Apr 11 2017
 * @Author:Ko00
 * @Copyright (c) 2017 
 *===========================================================
 * ==================== scrollbar commponet =================
 *===========================================================
 **/
(function ($) {
  /**
   * 声名jqCSS样式类型
   * 
   * @interface jqScrollCss
   */
  interface jqScrollCss {
    backgroundColor ? : string;
    background ? : string;
    borderRadius ? : string;
    border ? : string;
    width ? : string | number;
    height ? : string | number;
    position ? : string;
    top ? : string | number;
    left ? : string | number;
    bottom ? : string | number;
    right ? : string | number;
    zIndex ? : string | number;
    cursor ? : string ;
  }
  /**
   * 声名默认选项类型
   * 
   * @interface defaultType
   */
  interface defaultType {
    scrollBoxCssX: jqScrollCss;
    scrollBarCssX: jqScrollCss;
    scrollBoxCssY: jqScrollCss;
    scrollBarCssY: jqScrollCss;
  }
  const DEFAULT: defaultType = {
    scrollBoxCssX: {
      width: '100%',
      height: 3,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 98
    },
    scrollBarCssX: {
      height: '100%',
      backgroundColor: '#57a1ff',
      borderRadius: '5px',
      position: 'relative',
      left: 0,
      cursor:'default'
    },
    scrollBoxCssY: {
      width: 3,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 99
    },
    scrollBarCssY: {
      width: '100%',
      backgroundColor: '#57a1ff',
      borderRadius: '5px',
      position: 'relative',
      top: 0,
      cursor:'default'
    }
  }
  const NAMESPACE: string = 'customScroll';
  /*====================================分割线==========================================*/
  /**
   * 构建customScrollBar类
   */
  //类型声名 customScrollBar
  interface customScrollBarType {
    options: defaultType;
    $element: any;
    scaleX: number;
    scaleY: number;
    maxLeft: number;
    maxTop: number;
  }

  class customScrollBar implements customScrollBarType {
    options: defaultType;
    $element: any;
    scaleX: number;
    scaleY: number;
    maxLeft: number;
    maxTop: number;
    constructor(ele: any, options: defaultType) {
      this.$element = $(ele);
      this.options = options;
      this.init();
      this.bind();
    }
    init() {
      /**
       * 布局核心:在已有元素的上层构建一个假的滚动视图结构
       * t-scrollClient表示可视区域，t-scrollBoxX t-scrollBoxY表示对应滚动条
       */
      const $element = this.$element,
        options = this.options,
        $contentEle: any = $element.find('.t-scrollContent').css('position', 'relative'),
        ew: number = $element.outerWidth(), //容器元素宽度
        eh: number = $element.outerHeight(), //容器元素高度
        cw: number = $contentEle.outerWidth(), //内容元素宽度
        ch: number = $contentEle.outerHeight(), //内容元素高度
        sBoxHeightX: any = options.scrollBoxCssX.height,
        sBoxWidthY: any = options.scrollBoxCssY.width;
      /**
       * 处理不能操作实际内容区域的问题
       */
      let cPaddingRight: number = 0, //如果出现滚动条，需要给内容元素添加padding
        cPaddingBottom: number = 0;
      this.scaleX = ew / cw;
      this.scaleY = eh / ch;
      if (this.scaleX && this.scaleX < 1) {
        $element.append(this.renderScrollBarX());
        cPaddingBottom = parseInt(sBoxHeightX);
      }
      if (this.scaleY && this.scaleY < 1) {
        $element.append(this.renderScrollBarY());
        cPaddingRight = parseInt(sBoxWidthY);
      }
      //对内容区域添加样式
      $element.css({
        boxSizing: 'border-box',
        position:'relative',
        paddingRight: cPaddingRight,
        paddingBottom: cPaddingBottom
      });
    }
    bind() {
      /**
       * 核心部分:  
       * 滚动条宽度:sw   滚动条位移:sx 原始内容宽度:rw 原始内容位移:rx  展示框宽度:cw
       *  sx /sw = rx / rw =  cw / rw = sw / cw
       * 
       * */
      if (this.scaleX && this.scaleX < 1) {
        this.bindScrollBarX();
      }
      if (this.scaleY && this.scaleY < 1) {
        this.bindScrollBarY();
      }
    }
    renderScrollBarX() {
      const $element: any = this.$element,
        options: defaultType = this.options,
        scaleX: number = this.scaleX,
        scaleY: number = this.scaleY,
        $scrollBoxX: any = $('<dic class="t-scrollBoxX"></div>').css(options.scrollBoxCssX),
        $scrollBarX: any = $('<div class="t-scrollBarX"></div>').css(options.scrollBarCssX),
        sBoxHeightX: any = options.scrollBoxCssX.height,
        sBoxWidthY: any = options.scrollBoxCssY.width;
      let sBoxWidthX = $element.outerWidth(),
        sBarWidthX: number = sBoxWidthX * scaleX;
      this.maxLeft = sBoxWidthX - sBarWidthX;
      if (scaleY && scaleY < 1) {
        let maxDistanceX: number = sBoxWidthX - parseInt(sBoxWidthY);
        sBarWidthX = maxDistanceX * scaleX;
        this.maxLeft = maxDistanceX - sBarWidthX;
      }
      $scrollBarX.width(sBarWidthX);
      $scrollBoxX.append($scrollBarX);
      return $scrollBoxX;
    }
    renderScrollBarY() {
      const $element: any = this.$element,
        options: defaultType = this.options,
        scaleX: number = this.scaleX,
        scaleY: number = this.scaleY,
        $scrollBoxY: any = $('<dic class="t-scrollBoxY"></div>').css(options.scrollBoxCssY),
        $scrollBarY: any = $('<div class="t-scrollBarY"></div>').css(options.scrollBarCssY),
        sBoxWidthY: any = options.scrollBoxCssY.width,
        sBoxHeightX: any = options.scrollBoxCssX.height;
      let sBoxHeightY: number = $element.outerHeight(),
        sBarHeightY: number = sBoxHeightY * scaleY;
      this.maxTop = sBoxHeightY - sBarHeightY;
      if (scaleX && scaleX < 1) {
        let maxDistanceY: number = sBoxHeightY - parseInt(sBoxHeightX);
        sBarHeightY = maxDistanceY * scaleY;
        this.maxTop = maxDistanceY - sBarHeightY;
      }
      $scrollBarY.height(sBarHeightY);
      $scrollBoxY.append($scrollBarY);
      return $scrollBoxY;
    }
    bindScrollBarX() {
      const self = this,
        $element: any = self.$element,
        $scrollBarX: any = $element.find('.t-scrollBarX'),
        $scrollBoxX: any = $element.find('.t-scrollBoxX'),
        $contentEle: any = $element.find('.t-scrollContent');
      let originX: number, left: number = 0;
      //绑定事件两种:1.鼠标移动 
      //绑定鼠标移动
      $scrollBarX.on('mousedown.' + NAMESPACE, function (e) {
        e.stopPropagation();
        originX = e.clientX - this.offsetLeft; //这一步是具体实现的核心
        $(document).on('mousemove.' + NAMESPACE, function (e) {
          left = e.clientX - originX;
          left = Math.max(0, Math.min(left, self.maxLeft));
          $scrollBarX.css('left', left);
          $contentEle.css('left', -left / self.scaleX);
        });
        $(document).on('mouseup.' + NAMESPACE, (e) => {
          $(document).off('mousemove.' + NAMESPACE);
          $(document).off('mouseup.' + NAMESPACE);
        });
      });

      //给滚动槽绑定事件
      $scrollBoxX.on('click.' + NAMESPACE, function (e) {
        if ($(e.target).hasClass('t-scrollBoxX')) {
          const mCurLeft: number = e.offsetX, //鼠标相对于box元素框的Y轴距离
            barWidthX: number = $('.t-scrollBarX').width(),
            boxWidthX: number = $('.t-scrollBoxX').width(),
            mcDiffX: number = boxWidthX - Math.floor(boxWidthX / barWidthX) * barWidthX; //最小差值X
          //根据bar和box的宽度来进行划分
          if (boxWidthX % barWidthX === 0) {
            left = Math.floor(mCurLeft / barWidthX) * barWidthX;
          } else {
            if (0 <= mCurLeft && mCurLeft < mcDiffX) {
              left = 0;
            } else {
              left = mcDiffX + Math.floor((mCurLeft - mcDiffX) / barWidthX) * barWidthX;
            }
          }
          $scrollBarX.animate({
            left
          }, 1000);
          $contentEle.animate({
            left: -left / self.scaleX
          }, 1000);
        }
      });
    }
    bindScrollBarY() {
      const self: this = this,
        $element: any = self.$element,
        $scrollBoxY: any = $element.find('.t-scrollBoxY'),
        $scrollBarY: any = $element.find('.t-scrollBarY'),
        $contentEle: any = $element.find('.t-scrollContent');
      let originY: number,
        top: number = 0; //记录scrollbar在scrollbox的相对位置

      //声名滚轮滚动事件类型
      const wheelEvent: (e: any) => void = (e) => {
        e = e.originalEvent;
        const wheel: any = e.wheelDelta || e.detail;
        let isDown: boolean = true;
        e.wheelDelta ? (isDown = wheel < 0 ? true : false) : (isDown = wheel > 0 ? true : false);
        top += isDown ? 10 : -10;
        top = Math.max(0, Math.min(top, self.maxTop));
        //滚轮滚动的话，内容和滚动条都要滚动
        $scrollBarY.css('top', top);
        $contentEle.css('top', -top / self.scaleY);
      }
      //绑定滚轮事件
      if (navigator.userAgent.indexOf("Firefox") > 0) {
        $element.on('DOMMouseScroll.'+NAMESPACE, function (e) {
          wheelEvent(e);
        })
      } else {
        $element.on('mousewheel.'+NAMESPACE, function (e) {
          wheelEvent(e);
        })
      }

      //绑定事件两种:1.鼠标移动  2.滚动轴
      //绑定鼠标移动
      $scrollBarY.on('mousedown.' + NAMESPACE, function (e) {
        e.stopPropagation();
        originY = e.clientY - this.offsetTop; //这一步是具体实现的核心
        $(document).on('mousemove.' + NAMESPACE, function (e) {
          top = e.clientY - originY;
          top = Math.max(0, Math.min(top, self.maxTop));
          $scrollBarY.css('top', top);
          $contentEle.css('top', -top / self.scaleY);
        });
        $(document).on('mouseup.' + NAMESPACE, (e) => {
          $(document).off('mousemove.' + NAMESPACE);
          $(document).off('mouseup.' + NAMESPACE);
        });
      });

      //给滚动槽绑定事件
      $scrollBoxY.on('click.' + NAMESPACE, function (e) {
        if ($(e.target).hasClass('t-scrollBoxY')) {
          const mCurTop: number = e.offsetY, //鼠标相对于box元素框的Y轴距离
            barHeightY: number = $('.t-scrollBarY').height(),
            boxHeightY: number = $('.t-scrollBoxY').height(),
            mcDiffY: number = boxHeightY - Math.floor(boxHeightY / barHeightY) * barHeightY; //最小差值Y
          //根据bar和box的宽度来进行划分
          if (boxHeightY % barHeightY === 0) {
            top = Math.floor(mCurTop / barHeightY) * barHeightY;
          } else {
            if (0 <= mCurTop && mCurTop < mcDiffY) {
              top = 0;
            } else {
              top = mcDiffY + Math.floor((mCurTop - mcDiffY) / barHeightY) * barHeightY;
            }
          }
          $scrollBarY.animate({
            top
          }, 1000);
          $contentEle.animate({
            top: -top / self.scaleY
          }, 1000);
        }
      });
    }
  }

  $.fn.customScrollBar = function (option) {
    let options = $.extend(true, {}, DEFAULT, option);
    $(this).each(function (index, sdom) {
      new customScrollBar(sdom, options);
    })
    return this;
  }
})(jQuery)