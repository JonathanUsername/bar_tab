$(function(){

    function BarTab(template){
        var self = this;
        this.articles = ko.observableArray();
        this.tabs = ko.observableArray();
        this.fetched = ko.observable("");
        this.loading = ko.observable(true);
        self.fetchData = function(id){
            var key = window.SECRETS ? SECRETS.key : "test",
                url = "http://content.guardianapis.com/" + id + "?api-key=" + key + "&show-fields=all";
            self.fetched(id);
            this.articles.removeAll();
            $.get(url, self.parseData);
        }
        self.parseData = function(data){
            self.loading(false);
            var arr = data.response.results;
            for (var i in arr){
                var a = arr[i],
                    index = parseInt(i) + 1,
                    props = {
                        "url": a.webUrl,
                        "title": a.webTitle,
                        "text": a.fields.trailText,
                        "img": a.fields.thumbnail,
                        "index": index
                    };
                self.articles.push(new Thumb(props, template));
            }
        }
        self.makeTabs = function(tabs){
            for (var i in tabs)
                self.tabs.push(new Tab(tabs[i], self));
        }
    }

    function Tab(props, parent){
        var self = this;
        for (var i in props)
            self[i] = ko.observable(props[i]);
        this.parent = parent;
        this.is_selected = ko.pureComputed(function(){
            return parent.fetched() == self.id()
        }, self);
        this.select = function(){
            self.parent.fetchData(self.id());
        }
    }

    function Thumb(props){
        var self = this;
        for (var i in props)
            this[i] = ko.observable(props[i]);
    }

    var tabs = [{
        "name": "Football",
        "id": "football"
    },{
        "name": "Travel",
        "id": "travel"
    },
    {
        "name": "UK news",
        "id": "uk-news"
    }];

    bt = new BarTab(tabs);
    ko.applyBindings(bt);
    bt.makeTabs(tabs);
    bt.fetchData("travel");

})
