//这里是通过腾讯地图的api，只获取二级城市的选择，没有省份和市区县的选择
import qqmap from '../../utils/map.js';
Component({
  properties: {
    styles: {//这个是可以自定义最外层的view的样式
      type: String,
      value: '',
      observer: function (newval, oldval) {
        // 监听改变
        console.log(newval, oldval);
      }
    }
  },
  data: {
    //下面是字母排序
    letter: ["热门城市", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    cityListId: '',
    //下面是城市列表信息，这里只是模拟数据
    citylist: [
      {"letter":"定位情况","data":[{"cityName":"城市列表加载中~~~"}]}
      // { "letter": "A", "data": [{"cityName": "安徽" }] }, 
      // { "letter": "B", "data": [{"cityName": "巴中" }, {"cityName": "包头" }, {"cityName": "北京" }] }, 
      // { "letter": "C", "data": [{"cityName": "成都" }] }, 
      // { "letter": "D", "data": [{"cityName": "稻城" }] }, 
      // { "letter": "G", "data": [{"cityName": "广州" }, {"cityName": "桂林" }] }, 
      // { "letter": "H", "data": [{"cityName": "海南" }, {"cityName": "呼和浩特" }] }, 
      // { "letter": "L", "data": [{"cityName": "洛阳" }, {"cityName": "拉萨" }, {"cityName": "丽江" }] }, 
      // { "letter": "M", "data": [{"cityName": "眉山" }] }, 
      // { "letter": "N", "data": [{"cityName": "南京" }] }, 
      // { "letter": "S", "data": [{"cityName": "三亚" }, {"cityName": "上海" }] }, 
      // { "letter": "T", "data": [{"cityName": "天津" }] }, 
      // { "letter": "W", "data": [{"cityName": "乌鲁木齐" }, {"cityName": "武汉"}] },  
      // { "letter": "X", "data": [{"cityName": "西安" }, {"cityName": "香港" }, {"cityName": "厦门" }] }, 
      // { "letter": "Z", "data": [{"cityName": "张家口" }] }
    ],
    //下面是热门城市数据，模拟数据
    newcity: ['北京', '上海', '广州', '深圳', '成都', '杭州'],
    // citySel: '全国',
    locateCity: ''
  },
  methods: {
    //点击城市
    cityTap(e) {
      const val = e.currentTarget.dataset.val || '',
            types = e.currentTarget.dataset.types || '',
            Index = e.currentTarget.dataset.index || '',
            that = this;
      let city = this.data.citySel;
      switch (types) {
        case "locate":
          city = this.data.locateCity;
          break;
        case 'national':
          //全国
          city = '全国';
          break;
        case 'new':
          //热门城市
          city = val;
          break;
        case 'list':
          //城市列表
          city = val.cityName;
          break;
      }
      if (city) {
        wx.setStorage({
          key: 'city',
          data: city
        })
        //点击后给父组件可以通过bindcitytap事件，获取到cityname的值，这是子组件给父组件传值和触发事件的方法
        this.triggerEvent('citytap', { cityname: city });
      } else {
        console.log('还没有');
        this.getLocate();
      }
    },
    //点击城市字母
    letterTap(e) {
      const Item = e.currentTarget.dataset.item;
      if(Item == '热门城市'){
        this.setData({
          cityListId: "hot"
        });
      }else{
        this.setData({
          cityListId: Item
        });
      }
      console.log(this.data.cityListId);
    },
    //调用定位
    getLocate() {
      let that = this;
      new qqmap().getLocateInfo().then(function (val) {//这个方法在另一个文件里，下面有贴出代码
        console.log(val);
        if (val.indexOf('市') !== -1) {//这里是去掉“市”这个字
          console.log(val.indexOf('市') - 1);
          val = val.slice(0, val.indexOf('市'));
          console.log(val);
        }
        that.setData({
          locateCity: val
        });
        //把获取的定位和获取的时间放到本地存储
        wx.setStorageSync('locatecity', { city: val, time: new Date().getTime() });
      });
    },
    //获取城市列表
    CityList(){
      var _this = this;
      new qqmap().getCityList().then(function (val) {//这个方法在另一个文件里，下面有贴出代码
        console.log(val.result);
        // var citylists = val.result[1];
        var citylists = [{'cityName':'北京','pinyin':['bei','jing']},
                        {'cityName':'上海','pinyin':['shang','hai']},
                        {'cityName':'天津','pinyin':['tian','jin']},
                        {'cityName':'重庆','pinyin':['chong','qing']},
                        {'cityName':'香港','pinyin':['xiang','gang']},
                        {'cityName':'澳门','pinyin':['ao','men']}];
        for (var i = 0; i < val.result[1].length; i++) {
          let spliceCity = val.result[1][i].id.substring(0,3);//获取该城市的代码的前三个数字
          //去除北京、上海、天津、重庆四个直辖市的区县和香港澳门两个特别行政区的区县
          // if (spliceCity == '110' || spliceCity == '120' || spliceCity == '310' || spliceCity == '500' || spliceCity == '810' || spliceCity == '820' ) {
          //   citylists.splice(i,1);
          //   i = i - 1;
          // }
          if (spliceCity != '110' && spliceCity != '120' && spliceCity != '310' && spliceCity != '500' && spliceCity != '810' && spliceCity != '820' ) {
            citylists.push({'cityName':val.result[1][i].name,'pinyin':val.result[1][i].pinyin});
          }
        }
        console.log(citylists);

        var cityArr = [];//排序后罗列的城市数组
        var dataArr = [];//每一个拼音首字母相同的城市的无序数组
        var letterArr = [];//包含每一个字母并且包含城市拼音首字母为该字母的数组
        for (var j = 1; j < _this.data.letter.length; j++) { //j从1开始，因为letter的第一个是热门城市
          dataArr = [];
          for (var i = 0; i < citylists.length; i++) {
            if (citylists[i].pinyin[0].substring(0,1) == _this.data.letter[j].toLowerCase()) {
             dataArr.push({"cityName":citylists[i].cityName,'pinyin':citylists[i].pinyin});
            }
          }
          //如果有的拼音首字母开头的城市名压根不存在，则dataArr是空的，则不用加入城市列表数组
          if (dataArr.length != 0) {
            letterArr = {"letter":_this.data.letter[j],"data":dataArr};
            cityArr.push(letterArr);
          }else{ //去除没有该字母开头城市的英文字母
            _this.data.letter.splice(j,1);
            j = j - 1; //splice改变了数组长度，所以在此处做个变量处理，减1，让数组长度改变后当前的下一个数组子元素被遍历到
            _this.setData({
              letter:_this.data.letter
            })
          }
        }
        console.log(cityArr);
        _this.setData({
          citylist:cityArr
        });
        console.log(_this.data.citylist);
      });
    },
    // 授权定位回调
    locateReturn(e){
      console.log(e);
      this.getLocate();
    }
  },
  ready() {
    this.CityList();
    console.log(getApp());
    let that = this,
      cityOrTime = wx.getStorageSync('locatecity') || {},
      time = new Date().getTime(),
      city = '';
    if (!cityOrTime.time || (time - cityOrTime.time > 1800000)) {//每隔30分钟请求一次定位
      this.getLocate();
    } else {//如果未满30分钟，那么直接从本地缓存里取值
      that.setData({
        locateCity: cityOrTime.city
      })
    }
  }
});