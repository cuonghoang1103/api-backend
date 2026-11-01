# Ch3 · 3.4 — laptop ở Việt Nam, pop1 vừa rút ⇒ 198.19.1.1 giờ là pop2 Singapore ⇒ GeoDNS tưởng bạn ở Singapore
dig @198.19.1.1 id.server CH TXT +short
dig @198.19.1.1 +short static.labflow.test
curl -s --resolve static.labflow.test:80:$(dig @198.19.1.1 +short labflow.cdn.test) http://static.labflow.test/
