/**
 * Cloud AWS — Chương 3: Mạng VPC (soạn 19/11/2026, agent aws; phiên 20 chạy từ Mac qua ssh).
 * GIỮ title chương theo khung + slug bài khung đang có trên prod:
 *   3.1 vpc-subnet · 3.2 route-igw · 3.3 security-group · 3.4 nat-endpoint · 3.5 ket-noi · 3.6 vao-may · 3.7 lab-3 · 3.8 quiz (MỚI).
 * Mọi output chạy THẬT 19/11/2026 bằng scratchpad/aws/lab/c3/chay.sh + lab3/chay.sh:
 *   - AWS CLI 2.41.0 → LocalStack 4.12 (API EC2/VPC giả lập: chỉ CẤU HÌNH, không chuyển gói tin);
 *   - mạng Docker THẬT (container aws-c3-*, ảnh alpine + iptables/nmap): route local vs default, SG stateful vs NACL stateless,
 *     NAT bằng MASQUERADE, quét cổng trước/sau khi siết;
 *   - Terraform 1.17.2 + provider hashicorp/aws 6.73.0 với LocalStack (lab 3.7).
 * Khác AWS đã ghi rõ trong bài: LocalStack nhận subnet /29 (AWS chỉ /16–/28) và nhận peering hai VPC trùng dải (AWS từ chối);
 *   LocalStack không sinh bản ghi flow log; Terraform cần max_aggregation_interval = 60 với LocalStack.
 * Hằng OUT_* / MA_* sinh tự động (~/.rtq-aws/s03/sinh-p0.mjs). Giá: Price List API ap-southeast-1 (AmazonVPC 17/11/2026, AmazonEC2 NAT).
 * KHÔNG dùng backtick trần trong content; mã mẫu đi qua bash()/json()/hcl() của _chung.mjs.
 */
import { bash, json, hcl, out, tl, giai } from './_chung.mjs';

/* ═════ Output THẬT (19/11/2026 — scratchpad/aws/lab/c3/chay.sh + lab3/chay.sh: AWS CLI 2.41.0 → LocalStack 4.12; mạng Docker thật aws-c3-*) ═════ */
const OUT_31_CIDR_A = out("$ python3 cidr.py\nVPC 10.0.0.0/16 = 65536 addresses\n/16:  65536 addresses, usable in an AWS subnet: 65531\n/20:   4096 addresses, usable in an AWS subnet: 4091\n/24:    256 addresses, usable in an AWS subnet: 251\n/26:     64 addresses, usable in an AWS subnet: 59\n/28:     16 addresses, usable in an AWS subnet: 11\n/16 split into /24: 256 subnets: 10.0.0.0/24 10.0.1.0/24 ... 10.0.255.0/24\nAWS reserves in 10.0.1.0/24: 10.0.1.0 10.0.1.1 10.0.1.2 10.0.1.3 10.0.1.255\n10.0.0.0/16 vs 10.1.0.0/16 overlap: False\n10.0.0.0/16 vs 10.0.128.0/17 overlap: True\n172.16.0.0/12 vs 172.17.0.0/16 overlap: True");
const OUT_31_CIDR_B = out("$ aws ec2 describe-vpcs --query 'Vpcs[].[VpcId,CidrBlock,IsDefault]' --output text\nvpc-8957e5c3bd171731b\t172.31.0.0/16\tTrue\n$ aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=labflow-vpc}]' --query Vpc.VpcId --output text\nvpc-7b98a83d8a08c2d95\n$ aws ec2 create-subnet --vpc-id vpc-7b98a83d8a08c2d95 --cidr-block 10.0.1.0/24 --availability-zone ap-southeast-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-a}]' --query Subnet.SubnetId --output text\nsubnet-2290c3cd3897e9cf7\n$ aws ec2 create-subnet --vpc-id vpc-7b98a83d8a08c2d95 --cidr-block 10.0.2.0/24 --availability-zone ap-southeast-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-b}]' --query Subnet.SubnetId --output text\nsubnet-d64ae324f6d626fd0\n$ aws ec2 create-subnet --vpc-id vpc-7b98a83d8a08c2d95 --cidr-block 10.0.11.0/24 --availability-zone ap-southeast-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-a}]' --query Subnet.SubnetId --output text\nsubnet-888f15faadc2e9439\n$ aws ec2 create-subnet --vpc-id vpc-7b98a83d8a08c2d95 --cidr-block 10.0.12.0/24 --availability-zone ap-southeast-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-b}]' --query Subnet.SubnetId --output text\nsubnet-a5d68f70833d831bb\n$ aws ec2 describe-subnets --filters Name=vpc-id,Values=vpc-7b98a83d8a08c2d95 --query \"Subnets[].[Tags[?Key=='Name'].Value|[0],CidrBlock,AvailabilityZone,AvailabilityZoneId,AvailableIpAddressCount]\" --output table\n----------------------------------------------------------------------\n|                           DescribeSubnets                          |\n+-----------+---------------+-------------------+------------+-------+\n|  public-a |  10.0.1.0/24  |  ap-southeast-1a  |  apse1-az1 |  251  |\n|  private-a|  10.0.11.0/24 |  ap-southeast-1a  |  apse1-az1 |  251  |\n|  public-b |  10.0.2.0/24  |  ap-southeast-1b  |  apse1-az2 |  251  |\n|  private-b|  10.0.12.0/24 |  ap-southeast-1b  |  apse1-az2 |  251  |\n+-----------+---------------+-------------------+------------+-------+\n$ aws ec2 create-subnet --vpc-id vpc-7b98a83d8a08c2d95 --cidr-block 10.9.0.0/24\nAn error occurred (InvalidSubnet.Range) when calling the CreateSubnet operation: The CIDR '10.9.0.0/24' is invalid.\n$ aws ec2 create-subnet --vpc-id vpc-7b98a83d8a08c2d95 --cidr-block 10.0.1.128/25\nAn error occurred (InvalidSubnet.Conflict) when calling the CreateSubnet operation: The CIDR '10.0.1.128/25' conflicts with another subnet\n$ aws ec2 create-vpc --cidr-block 10.0.0.0/15\nAn error occurred (InvalidVpc.Range) when calling the CreateVpc operation: The CIDR '10.0.0.0/15' is invalid.\n$ aws ec2 create-subnet --vpc-id vpc-7b98a83d8a08c2d95 --cidr-block 10.0.99.0/29 --query Subnet.SubnetId --output text\nsubnet-869fd2a01be9be703\n$ aws ec2 describe-subnets --subnet-ids subnet-869fd2a01be9be703 --query 'Subnets[0].[CidrBlock,AvailableIpAddressCount]' --output text\n10.0.99.0/29\t3\n$ aws ec2 delete-subnet --subnet-id subnet-869fd2a01be9be703");
const OUT_32_ROUTE_A = out("$ aws ec2 describe-route-tables --filters Name=vpc-id,Values=vpc-7b98a83d8a08c2d95 --query 'RouteTables[].[RouteTableId,Associations[0].Main,Routes[0].DestinationCidrBlock,Routes[0].GatewayId]' --output text\nrtb-9648c4eef54192839\tTrue\t10.0.0.0/16\tlocal\n$ aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text\nigw-b2a0a141d4af36fa6\n$ aws ec2 attach-internet-gateway --vpc-id vpc-7b98a83d8a08c2d95 --internet-gateway-id igw-b2a0a141d4af36fa6\n$ aws ec2 create-route-table --vpc-id vpc-7b98a83d8a08c2d95 --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=rt-public}]' --query RouteTable.RouteTableId --output text\nrtb-2ca210199c53e04d3\n$ aws ec2 create-route --route-table-id rtb-2ca210199c53e04d3 --destination-cidr-block 0.0.0.0/0 --gateway-id igw-b2a0a141d4af36fa6\n{\n    \"Return\": true\n}\n$ aws ec2 associate-route-table --route-table-id rtb-2ca210199c53e04d3 --subnet-id subnet-2290c3cd3897e9cf7 --query AssociationId --output text\nrtbassoc-502bd5d8e0e86765c\n$ aws ec2 associate-route-table --route-table-id rtb-2ca210199c53e04d3 --subnet-id subnet-d64ae324f6d626fd0 --query AssociationId --output text\nrtbassoc-088468626ddd7310a\n$ aws ec2 describe-route-tables --route-table-ids rtb-2ca210199c53e04d3 --query 'RouteTables[0].Routes[].[DestinationCidrBlock,GatewayId,State]' --output table\n----------------------------------------------------\n|                DescribeRouteTables               |\n+--------------+-------------------------+---------+\n|  10.0.0.0/16 |  local                  |  active |\n|  0.0.0.0/0   |  igw-b2a0a141d4af36fa6  |  active |\n+--------------+-------------------------+---------+\n$ aws ec2 modify-subnet-attribute --subnet-id subnet-2290c3cd3897e9cf7 --map-public-ip-on-launch\n$ aws ec2 modify-subnet-attribute --subnet-id subnet-d64ae324f6d626fd0 --map-public-ip-on-launch\n$ aws ec2 describe-subnets --filters Name=vpc-id,Values=vpc-7b98a83d8a08c2d95 --query \"Subnets[].[Tags[?Key=='Name'].Value|[0],MapPublicIpOnLaunch]\" --output text\npublic-a\tTrue\nprivate-a\tFalse\npublic-b\tTrue\nprivate-b\tFalse");
const OUT_32_ROUTE_B = out("# ── Mạng Docker THẬT: một mạng có lối ra (giống subnet public), một mạng --internal (giống subnet private) ──\n$ docker network create --subnet 10.143.50.0/24 aws-c3-pub\nok\n$ docker network create --internal --subnet 10.143.1.0/24 aws-c3-priv\nok\n[aws-c3-maypub]$ ip route\ndefault via 10.143.50.1 dev eth0\n10.143.50.0/24 dev eth0 proto kernel scope link src 10.143.50.2\n[aws-c3-maypriv]$ ip route\n10.143.1.0/24 dev eth0 proto kernel scope link src 10.143.1.2\n[aws-c3-maypub]$ curl -sS -o /dev/null -w 'HTTP %{http_code}\\n' --max-time 8 https://aws.amazon.com/\nHTTP 200\n[aws-c3-maypriv]$ curl -sS -o /dev/null -w 'HTTP %{http_code}\\n' --max-time 8 https://1.1.1.1/\nHTTP 000\ncurl: (7) Failed to connect to 1.1.1.1:443 after 0 ms: Could not connect to server");
const OUT_33_SG_A = out("$ aws ec2 create-security-group --group-name labflow-web|labflow-app|labflow-db … ⇒ sg-eab7146c1e677cfc1 sg-52c9cd2ffc0ec8605 sg-8bde61c40702f3401\n$ aws ec2 authorize-security-group-ingress --group-id sg-eab7146c1e677cfc1 --protocol tcp --port 443 --cidr 0.0.0.0/0 --query 'SecurityGroupRules[0].[FromPort,CidrIpv4]' --output text\n443\t0.0.0.0/0\n$ aws ec2 authorize-security-group-ingress --group-id sg-52c9cd2ffc0ec8605 --protocol tcp --port 8080 --source-group sg-eab7146c1e677cfc1 --query 'SecurityGroupRules[0].[FromPort,ReferencedGroupInfo.GroupId]' --output text\n8080\tsg-eab7146c1e677cfc1\n$ aws ec2 authorize-security-group-ingress --group-id sg-8bde61c40702f3401 --protocol tcp --port 5432 --source-group sg-52c9cd2ffc0ec8605 --query 'SecurityGroupRules[0].[FromPort,ReferencedGroupInfo.GroupId]' --output text\n5432\tsg-52c9cd2ffc0ec8605\n$ aws ec2 describe-security-groups --group-ids sg-8bde61c40702f3401 --query 'SecurityGroups[0].{in:IpPermissions[0].[IpProtocol,FromPort,UserIdGroupPairs[0].GroupId],out:IpPermissionsEgress[0].[IpProtocol,IpRanges[0].CidrIp]}' --output json\n{\n    \"in\": [\n        \"tcp\",\n        5432,\n        \"sg-52c9cd2ffc0ec8605\"\n    ],\n    \"out\": [\n        \"-1\",\n        \"0.0.0.0/0\"\n    ]\n}\n$ aws ec2 describe-network-acls --filters Name=vpc-id,Values=vpc-7b98a83d8a08c2d95 Name=default,Values=true --query 'NetworkAcls[0].Entries[].[Egress,RuleNumber,Protocol,CidrBlock,RuleAction]' --output text\nTrue\t100\t-1\t0.0.0.0/0\tallow\nTrue\t32767\t-1\t0.0.0.0/0\tdeny\nFalse\t100\t-1\t0.0.0.0/0\tallow\nFalse\t32767\t-1\t0.0.0.0/0\tdeny\n$ aws ec2 create-network-acl --vpc-id vpc-7b98a83d8a08c2d95 --query NetworkAcl.NetworkAclId --output text\nacl-17ff7ace969469c95\n$ aws ec2 create-network-acl-entry --network-acl-id acl-17ff7ace969469c95 --ingress --rule-number 90 --protocol tcp --port-range From=0,To=65535 --cidr-block 203.0.113.0/24 --rule-action deny\n$ aws ec2 create-network-acl-entry --network-acl-id acl-17ff7ace969469c95 --ingress --rule-number 100 --protocol tcp --port-range From=443,To=443 --cidr-block 0.0.0.0/0 --rule-action allow\n$ aws ec2 create-network-acl-entry --network-acl-id acl-17ff7ace969469c95 --egress --rule-number 100 --protocol tcp --port-range From=1024,To=65535 --cidr-block 0.0.0.0/0 --rule-action allow\n$ aws ec2 describe-network-acls --network-acl-ids acl-17ff7ace969469c95 --query 'NetworkAcls[0].Entries[].[Egress,RuleNumber,PortRange.From,PortRange.To,CidrBlock,RuleAction]' --output text\nFalse\t90\t0\t65535\t203.0.113.0/24\tdeny\nFalse\t100\t443\t443\t0.0.0.0/0\tallow\nTrue\t100\t1024\t65535\t0.0.0.0/0\tallow");
const OUT_33_SG_B = out("# ── Gói tin THẬT: máy web 10.143.50.10 (busybox httpd cổng 80), khách 10.143.50.20 — luật iptables trong máy web ──\n# (A) kiểu SECURITY GROUP — stateful: vào cho cổng 80, chiều ra KHÔNG có luật nào ngoài 'gói trả lời của kết nối đã mở'\n[aws-c3-web]$ iptables -P INPUT DROP; iptables -P OUTPUT DROP; iptables -A INPUT -p tcp --dport 80 -j ACCEPT; iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT; iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT; iptables -S\n-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT DROP\n-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A OUTPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n[aws-c3-khach]$ curl -sS --max-time 4 http://10.143.50.10/\nLabFlow API ok\n[aws-c3-khach]$ curl -sS -o /dev/null -w 'HTTP %{http_code}\\n' --max-time 4 http://10.143.50.10:22/\ncurl: (28) Connection timed out after 4001 milliseconds\nHTTP 000\n# (B) kiểu NACL — stateless: không nhớ kết nối, chiều vào cho cổng 80, chiều ra chưa mở cổng tạm\n[aws-c3-web]$ iptables -F; iptables -P INPUT DROP; iptables -P OUTPUT DROP; iptables -A INPUT -p tcp --dport 80 -j ACCEPT; iptables -S\n-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT DROP\n-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT\n[aws-c3-khach]$ curl -sS --max-time 4 http://10.143.50.10/\ncurl: (28) Connection timed out after 4001 milliseconds\n[aws-c3-web]$ iptables -L OUTPUT -n -v | head -1\nChain OUTPUT (policy DROP 7 packets, 420 bytes)\n[aws-c3-khach]$ cat /proc/sys/net/ipv4/ip_local_port_range\n32768\t60999\n[aws-c3-web]$ iptables -A OUTPUT -p tcp --sport 80 --dport 1024:65535 -j ACCEPT; iptables -S OUTPUT\n-P OUTPUT DROP\n-A OUTPUT -p tcp -m tcp --sport 80 --dport 1024:65535 -j ACCEPT\n[aws-c3-khach]$ curl -sS --max-time 4 http://10.143.50.10/\nLabFlow API ok");
const OUT_34_NAT_A = out("$ aws ec2 allocate-address --domain vpc --query AllocationId --output text\neipalloc-612bcbb7f9f3c01a1\n$ aws ec2 create-nat-gateway --subnet-id subnet-2290c3cd3897e9cf7 --allocation-id eipalloc-612bcbb7f9f3c01a1 --query NatGateway.NatGatewayId --output text\nnat-255530a0f74e9a2d3\n$ aws ec2 describe-nat-gateways --nat-gateway-ids nat-255530a0f74e9a2d3 --query 'NatGateways[0].[State,SubnetId,NatGatewayAddresses[0].PrivateIp,NatGatewayAddresses[0].PublicIp]' --output text\navailable\tsubnet-2290c3cd3897e9cf7\t10.161.153.88\t127.243.210.162\n$ aws ec2 create-route-table --vpc-id vpc-7b98a83d8a08c2d95 --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=rt-private}]' --query RouteTable.RouteTableId --output text\nrtb-306b63c4f341f4999\n$ aws ec2 create-route --route-table-id rtb-306b63c4f341f4999 --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-255530a0f74e9a2d3\n{\n    \"Return\": true\n}\n$ aws ec2 associate-route-table --route-table-id rtb-306b63c4f341f4999 --subnet-id <private-a> (rồi private-b)\n$ aws ec2 describe-prefix-lists --filters Name=prefix-list-name,Values=com.amazonaws.ap-southeast-1.s3 --query 'PrefixLists[0].[PrefixListId,PrefixListName]' --output text\npl-968b9a76254a05f39\tcom.amazonaws.ap-southeast-1.s3\n$ aws ec2 create-vpc-endpoint --vpc-id vpc-7b98a83d8a08c2d95 --vpc-endpoint-type Gateway --service-name com.amazonaws.ap-southeast-1.s3 --route-table-ids rtb-306b63c4f341f4999 --query 'VpcEndpoint.[VpcEndpointId,State]' --output text\nvpce-62b936eba66c4ea82\tavailable\n$ aws ec2 describe-route-tables --route-table-ids rtb-306b63c4f341f4999 --query 'RouteTables[0].Routes[].[DestinationCidrBlock||DestinationPrefixListId,GatewayId||NatGatewayId]' --output table\n----------------------------------------------------\n|                DescribeRouteTables               |\n+-----------------------+--------------------------+\n|  10.0.0.0/16          |  local                   |\n|  0.0.0.0/0            |  nat-255530a0f74e9a2d3   |\n|  pl-968b9a76254a05f39 |  vpce-62b936eba66c4ea82  |\n+-----------------------+--------------------------+");
const OUT_34_NAT_B = out("# ── NAT THẬT bằng Docker: mạng private 10.143.1.0/24 (--internal), 'Internet giả' 10.143.200.0/24 (--internal) ──\n$ docker network create --internal --subnet 10.143.200.0/24 aws-c3-inet\nok\n[aws-c3-maypriv]$ ip route\n10.143.1.0/24 dev eth0 proto kernel scope link src 10.143.1.10\n[aws-c3-maypriv]$ curl -sS -o /dev/null -w 'HTTP %{http_code}\\n' --max-time 4 http://10.143.200.10/\nHTTP 000\ncurl: (7) Failed to connect to 10.143.200.10:80 after 0 ms: Could not connect to server\n[aws-c3-nat]$ ip -br addr | grep 10.143; cat /proc/sys/net/ipv4/ip_forward\neth0@if1061      UP             10.143.1.254/24\neth1@if1062      UP             10.143.200.254/24\n1\n[aws-c3-nat]$ iptables -t nat -A POSTROUTING -o eth1 -j MASQUERADE; iptables -t nat -S POSTROUTING\n-P POSTROUTING ACCEPT\n-A POSTROUTING -d 127.0.0.11/32 -j DOCKER_POSTROUTING\n-A POSTROUTING -o eth1 -j MASQUERADE\n[aws-c3-maypriv]$ ip route add default via 10.143.1.254; ip route\ndefault via 10.143.1.254 dev eth0\n10.143.1.0/24 dev eth0 proto kernel scope link src 10.143.1.10\n[aws-c3-maypriv]$ curl -sS -o /dev/null -w 'HTTP %{http_code}\\n' --max-time 4 http://10.143.200.10/\nHTTP 200\n$ docker logs aws-c3-srv 2>/dev/null | tail -1   # máy chủ ngoài Internet thấy ai gõ cửa?\n10.143.200.254 - - [19/Nov/2026:14:23:42 +0000] \"GET / HTTP/1.1\" 200 615 \"-\" \"curl/8.23.0\" \"-\"\n[aws-c3-nat]$ iptables -t nat -L POSTROUTING -n -v | grep -E 'pkts|MASQ'\n pkts bytes target     prot opt in     out     source               destination\n    1    60 MASQUERADE  all  --  *      eth1    0.0.0.0/0            0.0.0.0/0\n[aws-c3-srv]$ wget -q -T 4 -O- http://10.143.1.10/ || echo 'mã thoát' $?\nwget: can't connect to remote host (10.143.1.10): Network unreachable\nmã thoát 1");
const OUT_35_KETNOI = out("$ aws ec2 create-vpc --cidr-block 10.1.0.0/16 …  ⇒ B = vpc-bd2691e7ea89ffe0d\n$ aws ec2 create-vpc --cidr-block 10.2.0.0/16 …  ⇒ C = vpc-a465d3364d81af6ad\n$ aws ec2 create-vpc-peering-connection --vpc-id vpc-7b98a83d8a08c2d95 --peer-vpc-id vpc-bd2691e7ea89ffe0d --query VpcPeeringConnection.VpcPeeringConnectionId --output text\npcx-596f72b9cad1fbf6c\n$ aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id pcx-596f72b9cad1fbf6c --query VpcPeeringConnection.Status.Code --output text\nactive\n$ aws ec2 create-vpc-peering-connection --vpc-id vpc-bd2691e7ea89ffe0d --peer-vpc-id vpc-a465d3364d81af6ad … ; accept ⇒ pcx-84e98ef9ad4e3b693\n$ aws ec2 create-route --route-table-id rtb-9648c4eef54192839 --destination-cidr-block 10.1.0.0/16 --vpc-peering-connection-id pcx-596f72b9cad1fbf6c\n{\n    \"Return\": true\n}\n$ aws ec2 create-route --route-table-id rtb-9648c4eef54192839 --destination-cidr-block 10.2.0.0/16 --vpc-peering-connection-id pcx-596f72b9cad1fbf6c\n{\n    \"Return\": true\n}\n$ aws ec2 describe-vpc-peering-connections --query 'VpcPeeringConnections[].[VpcPeeringConnectionId,RequesterVpcInfo.CidrBlock,AccepterVpcInfo.CidrBlock,Status.Code]' --output table\n-------------------------------------------------------------------\n|                  DescribeVpcPeeringConnections                  |\n+------------------------+--------------+--------------+----------+\n|  pcx-596f72b9cad1fbf6c |  10.0.0.0/16 |  10.1.0.0/16 |  active  |\n|  pcx-84e98ef9ad4e3b693 |  10.1.0.0/16 |  10.2.0.0/16 |  active  |\n+------------------------+--------------+--------------+----------+\n# Thử peering hai VPC TRÙNG dải 10.0.0.0/16:\n$ aws ec2 create-vpc-peering-connection --vpc-id vpc-7b98a83d8a08c2d95 --peer-vpc-id vpc-69bb7c9423fae0dd5 --query VpcPeeringConnection.Status --output text\ninitiating-request\tInitiating Request to 000000000000\n$ aws ec2 create-transit-gateway --description labflow-hub --query TransitGateway.TransitGatewayId --output text\ntgw-e72d31f2bf32e9437\n$ aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id tgw-e72d31f2bf32e9437 --vpc-id <A|B|C> --subnet-ids <một subnet mỗi VPC>\n$ aws ec2 describe-transit-gateway-attachments --filters Name=transit-gateway-id,Values=tgw-e72d31f2bf32e9437 --query 'TransitGatewayAttachments[].[ResourceId,ResourceType,State]' --output table\n-----------------------------------------------\n|      DescribeTransitGatewayAttachments      |\n+------------------------+------+-------------+\n|  vpc-7b98a83d8a08c2d95 |  vpc |  available  |\n|  vpc-bd2691e7ea89ffe0d |  vpc |  available  |\n|  vpc-a465d3364d81af6ad |  vpc |  available  |\n+------------------------+------+-------------+");
const OUT_36_VAOMAY_A = out("$ docker network create --internal --subnet 10.143.60.0/24 aws-c3-quet\nok\n# Máy 10.143.60.10 mở SSH (cổng 22) và PostgreSQL (5432) cho cả mạng — như SG 0.0.0.0/0\n[aws-c3-hacker]$ nmap -Pn -sV -p 22,80,443,5432,6379 10.143.60.10 | grep -E '^[0-9]+/tcp|Nmap done'\n22/tcp   open   ssh        Dropbear sshd 2026.91 (protocol 2.0)\n80/tcp   closed http\n443/tcp  closed https\n5432/tcp open   postgresql PostgreSQL DB\n6379/tcp closed redis\nNmap done: 1 IP address (1 host up) scanned in 6.25 seconds\n# Siết lại như security group: 22 chỉ từ bastion 10.143.60.20, 5432 chỉ từ app 10.143.60.30\n[aws-c3-may]$ iptables -P INPUT DROP; iptables -A INPUT -i lo -j ACCEPT; iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT; iptables -A INPUT -p tcp --dport 22 -s 10.143.60.20 -j ACCEPT; iptables -A INPUT -p tcp --dport 5432 -s 10.143.60.30 -j ACCEPT; iptables -S INPUT\n-P INPUT DROP\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -s 10.143.60.20/32 -p tcp -m tcp --dport 22 -j ACCEPT\n-A INPUT -s 10.143.60.30/32 -p tcp -m tcp --dport 5432 -j ACCEPT\n[aws-c3-hacker]$ nmap -Pn -p 22,5432 10.143.60.10 | grep -E '^[0-9]+/tcp|Nmap done'\n22/tcp   filtered ssh\n5432/tcp filtered postgresql\nNmap done: 1 IP address (1 host up) scanned in 1.32 seconds\n[aws-c3-bastion]$ nmap -Pn -p 22,5432 10.143.60.10 | grep -E '^[0-9]+/tcp'\n22/tcp   open     ssh\n5432/tcp filtered postgresql\n[aws-c3-app]$ nmap -Pn -p 22,5432 10.143.60.10 | grep -E '^[0-9]+/tcp'\n22/tcp   filtered ssh\n5432/tcp open     postgresql\n[aws-c3-may]$ iptables -L INPUT -n -v | sed -n '1p'\nChain INPUT (policy DROP 8 packets, 352 bytes)");
const OUT_36_VAOMAY_B = out("# Flow log (LocalStack chỉ lưu CẤU HÌNH, không sinh bản ghi):\n$ aws logs create-log-group --log-group-name /labflow/vpc-flow\n$ aws ec2 create-flow-logs --resource-type VPC --resource-ids vpc-7b98a83d8a08c2d95 --traffic-type REJECT --log-destination-type cloud-watch-logs --log-group-name /labflow/vpc-flow --deliver-logs-permission-arn arn:aws:iam::000000000000:role/labflow-flowlog --query FlowLogIds --output text\nfl-5af9c8cae38d0cfe4\n$ aws ec2 describe-flow-logs --query 'FlowLogs[].[FlowLogId,ResourceId,TrafficType,LogGroupName]' --output text\nfl-5af9c8cae38d0cfe4\tvpc-7b98a83d8a08c2d95\tREJECT\t/labflow/vpc-flow\n# Đọc bản ghi flow log MẪU của tài liệu AWS (flow-log-records.html) bằng awk: ai bị từ chối, cổng nào\n$ cat flow-mau.txt\n2 123456789010 eni-1235b8ca123456789 172.31.16.139 172.31.16.21 20641 22 6 20 4249 1418530010 1418530070 ACCEPT OK\n2 123456789010 eni-1235b8ca123456789 172.31.9.69 172.31.9.12 49761 3389 6 20 4249 1418530010 1418530070 REJECT OK\n2 123456789010 eni-1235b8ca123456789 203.0.113.12 172.31.16.139 0 0 1 4 336 1432917027 1432917142 ACCEPT OK\n2 123456789010 eni-1235b8ca123456789 172.31.16.139 203.0.113.12 0 0 1 4 336 1432917094 1432917142 REJECT OK\n$ awk '$13==\"REJECT\" {print $4, \"->\", $5\":\"$7}' flow-mau.txt\n172.31.9.69 -> 172.31.9.12:3389\n172.31.16.139 -> 203.0.113.12:0");
const OUT_37_GIAI = out("$ bash giai.sh\nxong: vpc-eece43444b494828f\n$ bash cham.sh\nPASS 1. VPC labflow-vpc 10.20.0.0/16\nPASS 2. public và private đều trải ≥ 2 AZ\nPASS 3. subnet public: 0.0.0.0/0 → IGW + tự gán IP công khai\nPASS 4. subnet private: KHÔNG có đường tới IGW (kể cả qua bảng main)\nPASS 5. SG labflow-db: chỉ 5432 từ SG labflow-app\nPASS 6. không SG nào mở 22/5432 cho 0.0.0.0/0\nPASS 7. gateway endpoint S3 gắn vào bảng định tuyến private\nPASS 8. flow log bật cho VPC\nĐIỂM 8/8\n$ bash don.sh\nđã xoá vpc-eece43444b494828f\nđã xoá log group /labflow/vpc-flow\n$ bash con-gi.sh\n== ap-southeast-1\nNAT đang chạy : 0\nElastic IP    : 0\nVPC endpoint  : 0\nTransit GW    : 0\nVPN           : 0\nVPC tự tạo    : 0");
const OUT_37_TF = out("$ terraform init\n- Installing hashicorp/aws v6.73.0...\n- Installed hashicorp/aws v6.73.0 (signed by HashiCorp)\nTerraform has been successfully initialized!\n$ terraform apply -auto-approve\nError: creating Flow Log (vpc-8fff87c1dad37687c): operation error EC2: CreateFlowLogs … api error InvalidParameter: Invalid Flow Log Max Aggregation Interval\n$ terraform apply -auto-approve -var flow_log=false   # LocalStack: bỏ flow log khỏi Terraform\nApply complete! Resources: 0 added, 0 changed, 0 destroyed.\nvpc_id = \"vpc-8fff87c1dad37687c\"\n$ aws ec2 create-flow-logs --resource-type VPC --resource-ids $V --traffic-type REJECT --log-group-name /labflow/vpc-flow --deliver-logs-permission-arn arn:aws:iam::000000000000:role/labflow-flowlog --query FlowLogIds --output text\nfl-9828a1b3b09e4cc92\n$ bash cham.sh\nPASS 1. VPC labflow-vpc 10.20.0.0/16\nPASS 2. public và private đều trải ≥ 2 AZ\nPASS 3. subnet public: 0.0.0.0/0 → IGW + tự gán IP công khai\nPASS 4. subnet private: KHÔNG có đường tới IGW (kể cả qua bảng main)\nPASS 5. SG labflow-db: chỉ 5432 từ SG labflow-app\nPASS 6. không SG nào mở 22/5432 cho 0.0.0.0/0\nPASS 7. gateway endpoint S3 gắn vào bảng định tuyến private\nPASS 8. flow log bật cho VPC\nĐIỂM 8/8\n$ aws ec2 delete-flow-logs --flow-log-ids fl-9828a1b3b09e4cc92\n0\n$ terraform destroy -auto-approve -var flow_log=false\nDestroy complete! Resources: 17 destroyed.\n$ bash con-gi.sh\n== ap-southeast-1\nNAT đang chạy : 0\nElastic IP    : 0\nVPC endpoint  : 0\nTransit GW    : 0\nVPN           : 0\nVPC tự tạo    : 0");
const OUT_37_TRUOC = out("$ bash truoc.sh\nđã dựng bản vội: vpc-213777cf616205373\n$ bash cham.sh\nPASS 1. VPC labflow-vpc 10.20.0.0/16\nFAIL 2. public và private đều trải ≥ 2 AZ (public 1 AZ, private 1 AZ)\nFAIL 3. subnet public: 0.0.0.0/0 → IGW + tự gán IP công khai\nFAIL 4. subnet private: KHÔNG có đường tới IGW (kể cả qua bảng main)\nFAIL 5. SG labflow-db: chỉ 5432 từ SG labflow-app\nFAIL 6. không SG nào mở 22/5432 cho 0.0.0.0/0 (2 luật)\nFAIL 7. gateway endpoint S3 gắn vào bảng định tuyến private\nFAIL 8. flow log bật cho VPC\nĐIỂM 1/8");
const OUT_37_XOATHANG = out("$ aws ec2 delete-vpc --vpc-id $V   # xoá thẳng khi còn đồ bên trong\nAn error occurred (DependencyViolation) when calling the DeleteVpc operation: The vpc 'vpc-213777cf616205373' has dependencies and cannot be deleted.\n$ bash don.sh\nđã xoá vpc-213777cf616205373");
const MA_CIDR = bash("# Tính CIDR bằng thư viện chuẩn ipaddress — không cần nhớ bảng\nimport ipaddress as ip\n\nvpc = ip.ip_network(\"10.0.0.0/16\")\nprint(\"VPC\", vpc, \"=\", vpc.num_addresses, \"addresses\")\nfor p in (16, 20, 24, 26, 28):\n    n = 2 ** (32 - p)\n    print(f\"/{p}: {n:>6} addresses, usable in an AWS subnet: {n - 5}\")\nsubs = list(vpc.subnets(new_prefix=24))\nprint(\"/16 split into /24:\", len(subs), \"subnets:\", subs[0], subs[1], \"...\", subs[-1])\ns = list(ip.ip_network(\"10.0.1.0/24\"))\nprint(\"AWS reserves in 10.0.1.0/24:\", s[0], s[1], s[2], s[3], s[-1])\nfor a, b in [(\"10.0.0.0/16\", \"10.1.0.0/16\"), (\"10.0.0.0/16\", \"10.0.128.0/17\"), (\"172.16.0.0/12\", \"172.17.0.0/16\")]:\n    print(a, \"vs\", b, \"overlap:\", ip.ip_network(a).overlaps(ip.ip_network(b)))");
const MA_CHAM = bash("# Bộ chấm lab Chương 3 — 8 phép kiểm VPC \"labflow-vpc\" (chạy được với AWS thật hoặc LocalStack: đặt AWS_ENDPOINT_URL).\n# Dùng: bash cham.sh   (cần lệnh aws; trong lab cục bộ hàm aws được định nghĩa sẵn trỏ LocalStack)\ntype aws >/dev/null 2>&1 || { echo \"cần AWS CLI\"; exit 2; }\nd=0; ok() { echo \"PASS $1\"; d=$((d+1)); }; ko() { echo \"FAIL $1\"; }\nV=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=labflow-vpc --query 'Vpcs[0].VpcId' --output text)\nC=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=labflow-vpc --query 'Vpcs[0].CidrBlock' --output text)\n[ \"$C\" = 10.20.0.0/16 ] && ok \"1. VPC labflow-vpc 10.20.0.0/16\" || ko \"1. VPC labflow-vpc 10.20.0.0/16 (thấy: $C)\"\nsn() { aws ec2 describe-subnets --filters Name=vpc-id,Values=$V Name=tag:Tier,Values=$1 --query \"Subnets[].$2\" --output text; }\nPUB=$(sn public SubnetId); PRI=$(sn private SubnetId)\naz() { sn $1 AvailabilityZone | tr '\\t' '\\n' | sort -u | grep -c .; }\n[ $(az public) -ge 2 ] && [ $(az private) -ge 2 ] && ok \"2. public và private đều trải ≥ 2 AZ\" || ko \"2. public và private đều trải ≥ 2 AZ (public $(az public) AZ, private $(az private) AZ)\"\nrt() { local r; r=$(aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=$1 --query 'RouteTables[0].RouteTableId' --output text)\n  [ \"$r\" = None ] && r=$(aws ec2 describe-route-tables --filters Name=vpc-id,Values=$V Name=association.main,Values=true --query 'RouteTables[0].RouteTableId' --output text); echo $r; }\ntoiigw() { aws ec2 describe-route-tables --route-table-ids $1 --query \"RouteTables[0].Routes[?DestinationCidrBlock=='0.0.0.0/0'].GatewayId\" --output text | grep -c '^igw-'; }\nt=1; for s in $PUB; do [ \"$(toiigw $(rt $s))\" = 1 ] || t=0; [ \"$(aws ec2 describe-subnets --subnet-ids $s --query 'Subnets[0].MapPublicIpOnLaunch' --output text)\" = True ] || t=0; done\n[ -n \"$PUB\" ] && [ $t = 1 ] && ok \"3. subnet public: 0.0.0.0/0 → IGW + tự gán IP công khai\" || ko \"3. subnet public: 0.0.0.0/0 → IGW + tự gán IP công khai\"\nt=1; for s in $PRI; do [ \"$(toiigw $(rt $s))\" = 0 ] || t=0; done\n[ -n \"$PRI\" ] && [ $t = 1 ] && ok \"4. subnet private: KHÔNG có đường tới IGW (kể cả qua bảng main)\" || ko \"4. subnet private: KHÔNG có đường tới IGW (kể cả qua bảng main)\"\nAPP=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$V Name=group-name,Values=labflow-app --query 'SecurityGroups[0].GroupId' --output text)\nsgq() { aws ec2 describe-security-groups --filters Name=vpc-id,Values=$V Name=group-name,Values=labflow-db --query \"$1\" --output text; }\nDUNG=$(sgq \"length(SecurityGroups[0].IpPermissions[?FromPort==\\`5432\\` && ToPort==\\`5432\\` && length(IpRanges)==\\`0\\` && UserIdGroupPairs[0].GroupId=='$APP'])\")\nTONG=$(sgq \"length(SecurityGroups[0].IpPermissions)\")\n[ \"$DUNG/$TONG\" = 1/1 ] && ok \"5. SG labflow-db: chỉ 5432 từ SG labflow-app\" || ko \"5. SG labflow-db: chỉ 5432 từ SG labflow-app\"\nMO=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$V --query \"length(SecurityGroups[].IpPermissions[?(FromPort==\\`22\\` || FromPort==\\`5432\\`) && contains(IpRanges[].CidrIp, '0.0.0.0/0')][])\" --output text)\n[ \"$MO\" = 0 ] && ok \"6. không SG nào mở 22/5432 cho 0.0.0.0/0\" || ko \"6. không SG nào mở 22/5432 cho 0.0.0.0/0 ($MO luật)\"\nEPRT=$(aws ec2 describe-vpc-endpoints --filters Name=vpc-id,Values=$V Name=service-name,Values=com.amazonaws.ap-southeast-1.s3 --query 'VpcEndpoints[0].RouteTableIds' --output text)\nt=1; for s in $PRI; do grep -qw \"$(rt $s)\" <<<\"$EPRT\" || t=0; done\n[ -n \"$PRI\" ] && [ $t = 1 ] && ok \"7. gateway endpoint S3 gắn vào bảng định tuyến private\" || ko \"7. gateway endpoint S3 gắn vào bảng định tuyến private\"\nFL=$(aws ec2 describe-flow-logs --filter Name=resource-id,Values=$V --query 'length(FlowLogs)' --output text)\n[ \"${FL:-0}\" -ge 1 ] 2>/dev/null && ok \"8. flow log bật cho VPC\" || ko \"8. flow log bật cho VPC\"\necho \"ĐIỂM $d/8\"");
const MA_TRUOC = bash("# \"Cách làm vội\" hay gặp: một bảng định tuyến main có route ra IGW, SG mở toang. Dùng để thấy bộ chấm bắt lỗi.\nV=$(aws ec2 create-vpc --cidr-block 10.20.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=labflow-vpc}]' --query Vpc.VpcId --output text)\naws ec2 create-subnet --vpc-id $V --cidr-block 10.20.1.0/24 --availability-zone ap-southeast-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Tier,Value=public}]' >/dev/null\naws ec2 create-subnet --vpc-id $V --cidr-block 10.20.11.0/24 --availability-zone ap-southeast-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Tier,Value=private}]' >/dev/null\nI=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text); aws ec2 attach-internet-gateway --vpc-id $V --internet-gateway-id $I\nM=$(aws ec2 describe-route-tables --filters Name=vpc-id,Values=$V Name=association.main,Values=true --query 'RouteTables[0].RouteTableId' --output text)\naws ec2 create-route --route-table-id $M --destination-cidr-block 0.0.0.0/0 --gateway-id $I >/dev/null\nA=$(aws ec2 create-security-group --group-name labflow-app --description app --vpc-id $V --query GroupId --output text)\nB=$(aws ec2 create-security-group --group-name labflow-db --description db --vpc-id $V --query GroupId --output text)\naws ec2 authorize-security-group-ingress --group-id $A --protocol tcp --port 22 --cidr 0.0.0.0/0 >/dev/null\naws ec2 authorize-security-group-ingress --group-id $B --protocol tcp --port 5432 --cidr 0.0.0.0/0 >/dev/null\necho \"đã dựng bản vội: $V\"");
const MA_GIAI = bash("# LỜI GIẢI lab Chương 3 bằng AWS CLI — VPC 2 AZ, 2 public + 2 private, không NAT (tiết kiệm), endpoint S3, SG xâu chuỗi, flow log.\nset -e\nR=ap-southeast-1\ntag() { echo \"ResourceType=$1,Tags=[{Key=Name,Value=$2}${3:+,{Key=Tier,Value=$3\\}}]\"; }\nV=$(aws ec2 create-vpc --cidr-block 10.20.0.0/16 --tag-specifications \"$(tag vpc labflow-vpc)\" --query Vpc.VpcId --output text)\naws ec2 modify-vpc-attribute --vpc-id $V --enable-dns-hostnames\nmk() { aws ec2 create-subnet --vpc-id $V --cidr-block $2 --availability-zone $R$3 --tag-specifications \"$(tag subnet $1 $4)\" --query Subnet.SubnetId --output text; }\nPA=$(mk public-a 10.20.1.0/24 a public);   PB=$(mk public-b 10.20.2.0/24 b public)\nQA=$(mk private-a 10.20.11.0/24 a private); QB=$(mk private-b 10.20.12.0/24 b private)\nI=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)\naws ec2 attach-internet-gateway --vpc-id $V --internet-gateway-id $I\nRP=$(aws ec2 create-route-table --vpc-id $V --tag-specifications \"$(tag route-table rt-public)\" --query RouteTable.RouteTableId --output text)\naws ec2 create-route --route-table-id $RP --destination-cidr-block 0.0.0.0/0 --gateway-id $I >/dev/null\nRQ=$(aws ec2 create-route-table --vpc-id $V --tag-specifications \"$(tag route-table rt-private)\" --query RouteTable.RouteTableId --output text)\nfor s in $PA $PB; do aws ec2 associate-route-table --route-table-id $RP --subnet-id $s >/dev/null; aws ec2 modify-subnet-attribute --subnet-id $s --map-public-ip-on-launch; done\nfor s in $QA $QB; do aws ec2 associate-route-table --route-table-id $RQ --subnet-id $s >/dev/null; done\naws ec2 create-vpc-endpoint --vpc-id $V --vpc-endpoint-type Gateway --service-name com.amazonaws.$R.s3 --route-table-ids $RQ >/dev/null\nW=$(aws ec2 create-security-group --group-name labflow-alb --description \"ALB 443\" --vpc-id $V --query GroupId --output text)\nA=$(aws ec2 create-security-group --group-name labflow-app --description \"API 8080 tu ALB\" --vpc-id $V --query GroupId --output text)\nB=$(aws ec2 create-security-group --group-name labflow-db --description \"Postgres tu app\" --vpc-id $V --query GroupId --output text)\naws ec2 authorize-security-group-ingress --group-id $W --protocol tcp --port 443 --cidr 0.0.0.0/0 >/dev/null\naws ec2 authorize-security-group-ingress --group-id $A --protocol tcp --port 8080 --source-group $W >/dev/null\naws ec2 authorize-security-group-ingress --group-id $B --protocol tcp --port 5432 --source-group $A >/dev/null\naws logs create-log-group --log-group-name /labflow/vpc-flow 2>/dev/null || true\naws ec2 create-flow-logs --resource-type VPC --resource-ids $V --traffic-type REJECT --log-destination-type cloud-watch-logs \\\n  --log-group-name /labflow/vpc-flow --deliver-logs-permission-arn arn:aws:iam::000000000000:role/labflow-flowlog >/dev/null\necho \"xong: $V\"");
const MA_DON = bash("# DỌN VPC labflow-vpc theo đúng thứ tự phụ thuộc, rồi kiểm \"còn gì đang tính tiền\".\nV=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=labflow-vpc --query 'Vpcs[0].VpcId' --output text)\nfor f in $(aws ec2 describe-flow-logs --filter Name=resource-id,Values=$V --query 'FlowLogs[].FlowLogId' --output text); do aws ec2 delete-flow-logs --flow-log-ids $f >/dev/null; done\nfor e in $(aws ec2 describe-vpc-endpoints --filters Name=vpc-id,Values=$V --query 'VpcEndpoints[].VpcEndpointId' --output text); do aws ec2 delete-vpc-endpoints --vpc-endpoint-ids $e >/dev/null; done\nfor n in $(aws ec2 describe-nat-gateways --filter Name=vpc-id,Values=$V --query 'NatGateways[].NatGatewayId' --output text); do aws ec2 delete-nat-gateway --nat-gateway-id $n >/dev/null; done\nfor g in $(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$V --query \"SecurityGroups[?GroupName!='default'].GroupId\" --output text); do\n  aws ec2 revoke-security-group-ingress --group-id $g --ip-permissions \"$(aws ec2 describe-security-groups --group-ids $g --query 'SecurityGroups[0].IpPermissions' --output json)\" >/dev/null 2>&1; done\nfor g in $(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$V --query \"SecurityGroups[?GroupName!='default'].GroupId\" --output text); do aws ec2 delete-security-group --group-id $g; done\nfor i in $(aws ec2 describe-internet-gateways --filters Name=attachment.vpc-id,Values=$V --query 'InternetGateways[].InternetGatewayId' --output text); do\n  aws ec2 detach-internet-gateway --internet-gateway-id $i --vpc-id $V; aws ec2 delete-internet-gateway --internet-gateway-id $i; done\nfor s in $(aws ec2 describe-subnets --filters Name=vpc-id,Values=$V --query 'Subnets[].SubnetId' --output text); do aws ec2 delete-subnet --subnet-id $s; done\nfor r in $(aws ec2 describe-route-tables --filters Name=vpc-id,Values=$V --query 'RouteTables[?!(Associations[?Main])].RouteTableId' --output text); do\n  for a in $(aws ec2 describe-route-tables --route-table-ids $r --query 'RouteTables[0].Associations[].RouteTableAssociationId' --output text); do aws ec2 disassociate-route-table --association-id $a; done\n  aws ec2 delete-route-table --route-table-id $r; done\naws ec2 delete-vpc --vpc-id $V && echo \"đã xoá $V\"\naws logs delete-log-group --log-group-name /labflow/vpc-flow 2>/dev/null && echo \"đã xoá log group /labflow/vpc-flow\"");
const MA_CONGI = bash("# Còn gì của mạng đang tính tiền? (NAT theo giờ, IPv4 công khai/EIP theo giờ, interface endpoint theo giờ, TGW/VPN theo giờ)\nfor R in ${REGIONS:-ap-southeast-1}; do\n  echo \"== $R\"\n  echo \"NAT đang chạy : $(aws ec2 describe-nat-gateways --region $R --filter Name=state,Values=available,pending --query 'length(NatGateways)' --output text)\"\n  echo \"Elastic IP    : $(aws ec2 describe-addresses --region $R --query 'length(Addresses)' --output text)\"\n  echo \"VPC endpoint  : $(aws ec2 describe-vpc-endpoints --region $R --filters Name=vpc-endpoint-state,Values=available,pending --query 'length(VpcEndpoints)' --output text)\"\n  echo \"Transit GW    : $(aws ec2 describe-transit-gateways --region $R --filters Name=state,Values=available,pending --query 'length(TransitGateways)' --output text)\"\n  echo \"VPN           : $(aws ec2 describe-vpn-connections --region $R --filters Name=state,Values=available,pending --query 'length(VpnConnections)' --output text)\"\n  echo \"VPC tự tạo    : $(aws ec2 describe-vpcs --region $R --filters Name=is-default,Values=false --query 'length(Vpcs)' --output text)\"\ndone");
const MA_TF = hcl("terraform {\n  required_providers {\n    aws = { source = \"hashicorp/aws\", version = \"~> 6.0\" }\n  }\n}\n\n# Trỏ LocalStack trên máy bạn. Với AWS thật: xoá access_key/secret_key/skip_*/endpoints.\nprovider \"aws\" {\n  region                      = \"ap-southeast-1\"\n  access_key                  = \"test\"\n  secret_key                  = \"test\"\n  skip_credentials_validation = true\n  skip_requesting_account_id  = true\n  endpoints {\n    ec2  = \"http://127.0.0.1:44566\"\n    logs = \"http://127.0.0.1:44566\"\n  }\n  default_tags {\n    tags = { Project = \"labflow\", Lab = \"c3\" }\n  }\n}\n\nlocals {\n  azs     = [\"ap-southeast-1a\", \"ap-southeast-1b\"]\n  public  = [\"10.20.1.0/24\", \"10.20.2.0/24\"]\n  private = [\"10.20.11.0/24\", \"10.20.12.0/24\"]\n}\n\nresource \"aws_vpc\" \"main\" {\n  cidr_block           = \"10.20.0.0/16\"\n  enable_dns_hostnames = true\n  tags                 = { Name = \"labflow-vpc\" }\n}\n\nresource \"aws_subnet\" \"public\" {\n  count                   = 2\n  vpc_id                  = aws_vpc.main.id\n  cidr_block              = local.public[count.index]\n  availability_zone       = local.azs[count.index]\n  map_public_ip_on_launch = true\n  tags                    = { Name = \"public-${count.index}\", Tier = \"public\" }\n}\n\nresource \"aws_subnet\" \"private\" {\n  count             = 2\n  vpc_id            = aws_vpc.main.id\n  cidr_block        = local.private[count.index]\n  availability_zone = local.azs[count.index]\n  tags              = { Name = \"private-${count.index}\", Tier = \"private\" }\n}\n\nresource \"aws_internet_gateway\" \"igw\" {\n  vpc_id = aws_vpc.main.id\n}\n\nresource \"aws_route_table\" \"public\" {\n  vpc_id = aws_vpc.main.id\n  route {\n    cidr_block = \"0.0.0.0/0\"\n    gateway_id = aws_internet_gateway.igw.id\n  }\n}\n\nresource \"aws_route_table\" \"private\" {\n  vpc_id = aws_vpc.main.id # không route 0.0.0.0/0: không NAT, không tốn 0,059 USD/giờ\n}\n\nresource \"aws_route_table_association\" \"public\" {\n  count          = 2\n  subnet_id      = aws_subnet.public[count.index].id\n  route_table_id = aws_route_table.public.id\n}\n\nresource \"aws_route_table_association\" \"private\" {\n  count          = 2\n  subnet_id      = aws_subnet.private[count.index].id\n  route_table_id = aws_route_table.private.id\n}\n\nresource \"aws_vpc_endpoint\" \"s3\" {\n  vpc_id            = aws_vpc.main.id\n  service_name      = \"com.amazonaws.ap-southeast-1.s3\"\n  vpc_endpoint_type = \"Gateway\"\n  route_table_ids   = [aws_route_table.private.id]\n}\n\nresource \"aws_security_group\" \"alb\" {\n  name   = \"labflow-alb\"\n  vpc_id = aws_vpc.main.id\n  ingress {\n    from_port   = 443\n    to_port     = 443\n    protocol    = \"tcp\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n}\n\nresource \"aws_security_group\" \"app\" {\n  name   = \"labflow-app\"\n  vpc_id = aws_vpc.main.id\n  ingress {\n    from_port       = 8080\n    to_port         = 8080\n    protocol        = \"tcp\"\n    security_groups = [aws_security_group.alb.id]\n  }\n}\n\nresource \"aws_security_group\" \"db\" {\n  name   = \"labflow-db\"\n  vpc_id = aws_vpc.main.id\n  ingress {\n    from_port       = 5432\n    to_port         = 5432\n    protocol        = \"tcp\"\n    security_groups = [aws_security_group.app.id]\n  }\n}\n\nresource \"aws_cloudwatch_log_group\" \"flow\" {\n  name              = \"/labflow/vpc-flow\"\n  retention_in_days = 7\n}\n\n# LocalStack 4.12 từ chối MỌI MaxAggregationInterval mà provider gửi (InvalidParameter) ⇒ chạy cục bộ: -var flow_log=false\n# rồi bật flow log bằng CLI. Trên AWS thật để mặc định true.\nvariable \"flow_log\" {\n  type    = bool\n  default = true\n}\n\nresource \"aws_flow_log\" \"vpc\" {\n  count           = var.flow_log ? 1 : 0\n  vpc_id          = aws_vpc.main.id\n  traffic_type    = \"REJECT\"\n  log_destination = aws_cloudwatch_log_group.flow.arn\n  iam_role_arn    = \"arn:aws:iam::000000000000:role/labflow-flowlog\"\n}\n\noutput \"vpc_id\" {\n  value = aws_vpc.main.id\n}");

/* ═════ 3.1 — VPC, CIDR và subnet ═════ */
const L31_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 1</span>
<h2>3.1 — VPC, CIDR and subnets: drawing your own network</h2>
<p class="lead">Everything you will run on AWS from now on — EC2 machines, RDS databases, ECS containers, load balancers — lives inside a network you design: a <strong>VPC</strong> (Virtual Private Cloud). On a VPS you never drew a network; the provider gave you one public IP and Docker invented small private networks for your containers. On AWS the network is yours, it is empty until you plan it, and a bad plan made on day one (an address range that overlaps the office, subnets too small) is very expensive to undo later. This lesson teaches you to plan it with arithmetic you can check, not with guesses.</p>

<h3>The housing-estate picture (used for the whole chapter)</h3>
<p>Imagine a gated housing estate. The <strong>VPC</strong> is the estate with its own address plan. Each <strong>subnet</strong> is one building, and a building stands on one plot of land — one Availability Zone. The <strong>route table</strong> is the signpost at each building's door (“to the highway: main gate”). The <strong>Internet gateway</strong> is the main gate onto the highway. The <strong>NAT gateway</strong> is the mail room that sends residents' letters out with the estate's return address. The <strong>security group</strong> is each flat's smart lock, which remembers who you let in; the <strong>network ACL</strong> is the guard at the building entrance with a checklist, checking people both coming in and going out. Lessons 3.2–3.6 open one of these doors each.</p>

<h3>What a VPC is — and is not</h3>
<ul>
  <li>A VPC belongs to <strong>one account and one region</strong>. It spans every Availability Zone of that region; subnets do not.</li>
  <li>It is <strong>logically isolated</strong>: nothing gets in or out until you add a gateway and routes. A new VPC with no gateway cannot reach the Internet at all.</li>
  <li>It is <strong>free</strong>. You pay for things placed in it (NAT gateways, public IPv4 addresses, endpoints, machines), not for the VPC or its subnets and route tables.</li>
  <li>It is <strong>not a machine</strong> and not a firewall. It is an address space plus rules about where packets may go.</li>
</ul>

<h3>CIDR in five minutes</h3>
<p>A CIDR block such as <code>10.0.0.0/16</code> means “the first 16 bits are fixed, the rest are yours”. An IPv4 address has 32 bits, so a <code>/n</code> block holds 2<sup>32−n</sup> addresses: <code>/16</code> = 65,536, <code>/24</code> = 256, <code>/28</code> = 16. A bigger number after the slash means a <em>smaller</em> network. You do not need to memorise a table — Python's standard library does the arithmetic, and this is exactly what we ran on 19/11/2026:</p>
${MA_CIDR}
${OUT_31_CIDR_A}
<ul>
  <li><strong>Five addresses are taken by AWS in every subnet</strong>: the network address (.0), the VPC router (.1), the Amazon DNS server (.2), one reserved for future use (.3) and the last address (.255 in a /24). That is why a /24 gives you 251 usable addresses and a /28 only 11.</li>
  <li><strong>Overlap is the mistake that cannot be fixed later.</strong> <code>10.0.0.0/16</code> and <code>10.0.128.0/17</code> overlap, so two VPCs with those ranges can never be peered or joined by VPN. The last line is a trap many backend developers fall into: Docker's default bridge network <code>172.17.0.0/16</code> sits inside <code>172.16.0.0/12</code>. If you pick <code>172.17.x.x</code> for a VPC, containers on a machine in that VPC may suddenly be unable to reach part of it.</li>
  <li>Use the private ranges of RFC 1918: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>. A VPC can be from <code>/16</code> (largest) to <code>/28</code> (smallest); you can add secondary CIDR blocks later, but you cannot shrink or change the primary one.</li>
</ul>

<h3>Subnets: one building, one Availability Zone</h3>
<p>A subnet is a slice of the VPC's range placed in <strong>exactly one AZ</strong>. If that AZ has a problem, everything in the subnet has the same problem — so production systems always use at least two subnets per tier, in two different AZs. The classic layout for a backend like LabFlow (the lab-booking API you build in the Node.js and Spring Boot courses):</p>
<table>
  <thead><tr><th>Tier</th><th>AZ a</th><th>AZ b</th><th>What lives there</th></tr></thead>
  <tbody>
    <tr><td>public</td><td>10.0.1.0/24</td><td>10.0.2.0/24</td><td>Load balancer, NAT gateway — things the Internet must reach</td></tr>
    <tr><td>private (app)</td><td>10.0.11.0/24</td><td>10.0.12.0/24</td><td>API containers / EC2 — reachable only from the load balancer</td></tr>
    <tr><td>private (data)</td><td>10.0.21.0/24</td><td>10.0.22.0/24</td><td>RDS PostgreSQL, Redis — reachable only from the app tier</td></tr>
  </tbody>
</table>
<p>“Public” and “private” are not checkboxes on a subnet. They are the result of the subnet's route table, which is lesson 3.2. Here we only create the address plan. All commands below ran on LocalStack 4.12 with the real AWS CLI 2.41.0; on AWS they are identical (only IDs differ):</p>
${OUT_31_CIDR_B}
<ul>
  <li>The account already had a <strong>default VPC</strong> <code>172.31.0.0/16</code>. AWS creates one per region so that a beginner's first EC2 instance “just works”: its default subnets are public. Fine for a five-minute test, wrong for production — your database would be one security-group mistake away from the Internet.</li>
  <li><code>AvailabilityZoneId</code> (<code>apse1-az1</code>) is the physical zone; the name <code>ap-southeast-1a</code> can map to a different physical zone in another account (lesson 0.3). When two accounts must line up AZs, compare IDs.</li>
  <li>The three errors are the guard rails: a subnet outside the VPC range (<code>InvalidSubnet.Range</code>), a subnet overlapping another (<code>InvalidSubnet.Conflict</code>) and a VPC larger than /16 (<code>InvalidVpc.Range</code>).</li>
  <li><strong>Emulator difference:</strong> LocalStack accepted a <code>/29</code> subnet (8 addresses, 3 usable). Real AWS rejects it: subnets must be between /16 and /28. Never trust an emulator for limits — read the documentation.</li>
</ul>

<h3>How big should things be?</h3>
<ul>
  <li><strong>VPC: /16.</strong> It costs nothing and leaves room for many subnets. Write the range into a shared “IP plan” document so the next team does not reuse it.</li>
  <li><strong>Subnets: /24 for most tiers, /20 or larger for container platforms.</strong> ECS Fargate and EKS give every task or pod its own IP address; a /24 runs out at 251. Running out of IPs shows up as “cannot launch task” errors at the worst time — during a traffic spike.</li>
  <li><strong>Reserve space.</strong> Do not hand out the whole /16 on day one; leave blocks for future AZs and tiers.</li>
  <li><strong>IPv6</strong> is optional: AWS gives a VPC a /56 and each subnet a /64. You will meet it again with the egress-only Internet gateway in lesson 3.2.</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> your router hands out <code>192.168.1.x</code>. If your company VPN also uses <code>192.168.1.0/24</code>, you cannot reach the office printer from home — the same overlap problem, at home scale.</li>
  <li><strong>At work:</strong> the first ticket a new cloud engineer often gets is “we cannot peer the new VPC with the data team's VPC”. The cause is almost always two teams that both chose <code>10.0.0.0/16</code>. Fixing it means rebuilding one VPC, which means moving every machine and database inside it.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How many usable IPs are in a /24 subnet on AWS, and why?”</strong> — 251: 256 minus five reserved addresses (network, VPC router, DNS, future use, last address).</li>
  <li><strong>“Can a subnet span two Availability Zones?”</strong> — No. A subnet lives in one AZ; high availability comes from at least two subnets per tier in different AZs.</li>
  <li><strong>“What makes a subnet public?”</strong> — Its route table sends <code>0.0.0.0/0</code> to an Internet gateway, and its resources have public IPs. There is no “public” flag on the subnet itself.</li>
  <li><strong>“Why should you care about CIDR overlap on day one?”</strong> — Peering, Transit Gateway and VPN all require non-overlapping ranges, and you cannot change a VPC's primary CIDR. Overlap means rebuilding.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run <code>cidr.py</code> and change it to split <code>10.20.0.0/16</code> into <code>/20</code> blocks. How many blocks, and how many usable IPs in each on AWS?</li>
  <li>Start LocalStack (lesson 0.4) and create VPC <code>10.20.0.0/16</code> named <code>labflow-vpc</code> with four /24 subnets: two public, two private, spread over <code>ap-southeast-1a</code> and <code>ap-southeast-1b</code>. Tag each subnet with <code>Tier=public</code> or <code>Tier=private</code>.</li>
  <li>Trigger <code>InvalidSubnet.Conflict</code> on purpose.</li>
</ol>
<p><strong>Done when:</strong> <code>describe-subnets</code> shows four subnets in two AZs with 251 free addresses each, you can explain the 5 missing addresses, and you have written your answer for the /20 split (16 blocks, 4,091 usable each).</p>
${giai('Hint: commands', bash(`
python3 -c "import ipaddress as i; b=list(i.ip_network('10.20.0.0/16').subnets(new_prefix=20)); print(len(b), b[0].num_addresses-5)"
V=$(aws ec2 create-vpc --cidr-block 10.20.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=labflow-vpc}]' --query Vpc.VpcId --output text)
aws ec2 create-subnet --vpc-id $V --cidr-block 10.20.1.0/24 --availability-zone ap-southeast-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-a},{Key=Tier,Value=public}]'
# … 10.20.2.0/24 (1b, public), 10.20.11.0/24 (1a, private), 10.20.12.0/24 (1b, private)
aws ec2 create-subnet --vpc-id $V --cidr-block 10.20.1.128/25   # InvalidSubnet.Conflict`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">VPC</span><span class="v">Your isolated network in one region; free; spans all AZs of the region.</span></div>
  <div class="kv"><span class="k">CIDR /n</span><span class="v">Address block with n fixed bits; 2^(32−n) addresses. VPC /16–/28.</span></div>
  <div class="kv"><span class="k">Subnet</span><span class="v">Slice of the VPC range in exactly one AZ; /16–/28.</span></div>
  <div class="kv"><span class="k">5 reserved IPs</span><span class="v">.0 network, .1 router, .2 DNS, .3 future, last address.</span></div>
  <div class="kv"><span class="k">RFC 1918</span><span class="v">Private ranges 10/8, 172.16/12, 192.168/16.</span></div>
  <div class="kv"><span class="k">Default VPC</span><span class="v">172.31.0.0/16 with public default subnets, created per region for quick starts.</span></div>
  <div class="kv"><span class="k">AZ ID</span><span class="v">Physical zone ID (apse1-az1); names like 1a may differ between accounts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A VPC is a free, isolated address space in one region; subnets put slices of it into single AZs.</li>
  <li>Plan CIDR first: /16 VPC, no overlap with other VPCs, offices or Docker's 172.17.0.0/16.</li>
  <li>Every subnet loses 5 addresses; container platforms need bigger subnets.</li>
  <li>Use two subnets per tier in two AZs; “public” comes from routing, not from a flag.</li>
  <li>Emulators can be looser than AWS (LocalStack accepted /29) — limits come from the docs.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html', '🧭', 'AWS docs — How Amazon VPC works', 'VPC, subnets, route tables, gateways in one page.')}
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html', '📐', 'AWS docs — Subnet CIDR blocks', 'The /16–/28 rule and the five reserved addresses.')}

<h3>Sources</h3>
<ul>
  <li>How VPC works: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html</a></li>
  <li>Subnet sizing, reserved addresses: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html</a></li>
  <li>VPC CIDR blocks (/16–/28, secondary blocks): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html</a></li>
  <li>Default VPC: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html</a></li>
  <li>RFC 1918 private address space: <a href="https://www.rfc-editor.org/rfc/rfc1918" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc1918</a></li>
  <li>Docker bridge networks: <a href="https://docs.docker.com/engine/network/drivers/bridge/" target="_blank" rel="noopener">docs.docker.com/engine/network/drivers/bridge/</a></li>
</ul>
</div>
`;

const L31_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 1</span>
<h2>3.1 — VPC, CIDR và subnet: tự vẽ mạng của mình</h2>
<p class="lead">Mọi thứ bạn chạy trên AWS từ giờ — máy EC2, cơ sở dữ liệu RDS, container ECS, bộ cân bằng tải — đều nằm trong một mạng do bạn thiết kế: <strong>VPC</strong> (Virtual Private Cloud). Trên VPS bạn chưa bao giờ phải vẽ mạng: nhà cung cấp cho một IP công khai, còn Docker tự dựng vài mạng riêng nhỏ cho container. Trên AWS, mạng là của bạn, trống trơn cho tới khi bạn quy hoạch, và một quy hoạch sai từ ngày đầu (dải địa chỉ trùng mạng văn phòng, subnet quá nhỏ) rất đắt để làm lại. Bài này dạy bạn quy hoạch bằng phép tính kiểm được, không bằng cảm tính.</p>

<h3>Hình ảnh khu đô thị (dùng cho cả chương)</h3>
<p>Hãy hình dung một khu đô thị có cổng. <strong>VPC</strong> là cả khu với sơ đồ địa chỉ riêng. Mỗi <strong>subnet</strong> là một toà nhà, và một toà đứng trên một khu đất — một Availability Zone. <strong>Bảng định tuyến</strong> là biển chỉ đường ở cửa mỗi toà (“ra đường lớn: đi cổng chính”). <strong>Internet gateway</strong> là cổng chính ra đường lớn. <strong>NAT gateway</strong> là phòng thư gửi thư của cư dân ra ngoài, ghi địa chỉ người gửi là địa chỉ của khu. <strong>Security group</strong> là khoá thông minh của từng căn hộ, nhớ ai bạn đã cho vào; <strong>network ACL</strong> là bảo vệ ở sảnh toà nhà cầm danh sách, kiểm cả người vào lẫn người ra. Bài 3.2–3.6 mỗi bài mở một cánh cửa trong số này.</p>

<h3>VPC là gì — và không phải là gì</h3>
<ul>
  <li>Một VPC thuộc về <strong>một tài khoản và một region</strong>. Nó trải qua mọi Availability Zone của region đó; subnet thì không.</li>
  <li>Nó <strong>cô lập về logic</strong>: không gì vào hay ra được cho tới khi bạn thêm gateway và route. Một VPC mới không có gateway thì hoàn toàn không ra được Internet.</li>
  <li>Nó <strong>miễn phí</strong>. Bạn trả tiền cho thứ đặt bên trong (NAT gateway, địa chỉ IPv4 công khai, endpoint, máy chủ), không trả cho VPC, subnet hay bảng định tuyến.</li>
  <li>Nó <strong>không phải một cái máy</strong> và không phải tường lửa. Nó là một không gian địa chỉ cộng với luật gói tin được đi đâu.</li>
</ul>

<h3>CIDR trong năm phút</h3>
<p>Một khối CIDR như <code>10.0.0.0/16</code> nghĩa là “16 bit đầu cố định, phần còn lại của bạn”. Địa chỉ IPv4 có 32 bit, nên khối <code>/n</code> chứa 2<sup>32−n</sup> địa chỉ: <code>/16</code> = 65.536, <code>/24</code> = 256, <code>/28</code> = 16. Số sau dấu gạch chéo càng LỚN thì mạng càng NHỎ. Bạn không cần học thuộc bảng — thư viện chuẩn của Python tính hộ, và đây đúng là thứ đã chạy ngày 19/11/2026:</p>
${MA_CIDR}
${OUT_31_CIDR_A}
<ul>
  <li><strong>AWS lấy năm địa chỉ trong MỌI subnet</strong>: địa chỉ mạng (.0), router của VPC (.1), máy chủ DNS của Amazon (.2), một địa chỉ để dành (.3) và địa chỉ cuối (.255 trong /24). Vì thế /24 cho bạn 251 địa chỉ dùng được, /28 chỉ còn 11.</li>
  <li><strong>Trùng dải là lỗi không sửa được về sau.</strong> <code>10.0.0.0/16</code> và <code>10.0.128.0/17</code> chồng nhau, nên hai VPC mang hai dải đó không bao giờ peering hay nối VPN được. Dòng cuối là cái bẫy nhiều lập trình viên backend gặp: mạng bridge mặc định của Docker <code>172.17.0.0/16</code> nằm trong <code>172.16.0.0/12</code>. Chọn <code>172.17.x.x</code> cho VPC thì container trên một máy trong VPC đó có thể bỗng không tới được một phần của chính VPC.</li>
  <li>Dùng các dải riêng của RFC 1918: <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>. Một VPC rộng từ <code>/16</code> (lớn nhất) tới <code>/28</code> (nhỏ nhất); sau này có thể thêm dải phụ, nhưng không thu nhỏ hay đổi được dải chính.</li>
</ul>

<h3>Subnet: một toà nhà, một Availability Zone</h3>
<p>Subnet là một lát cắt của dải VPC đặt trong <strong>đúng một AZ</strong>. AZ đó gặp sự cố thì mọi thứ trong subnet gặp cùng sự cố — nên hệ thống thật luôn dùng ít nhất hai subnet cho mỗi tầng, ở hai AZ khác nhau. Bố cục kinh điển cho một backend như LabFlow (API đặt lịch phòng lab bạn làm ở khoá Node.js và Spring Boot):</p>
<table>
  <thead><tr><th>Tầng</th><th>AZ a</th><th>AZ b</th><th>Thứ đặt ở đó</th></tr></thead>
  <tbody>
    <tr><td>public</td><td>10.0.1.0/24</td><td>10.0.2.0/24</td><td>Bộ cân bằng tải, NAT gateway — thứ Internet phải tới được</td></tr>
    <tr><td>private (ứng dụng)</td><td>10.0.11.0/24</td><td>10.0.12.0/24</td><td>Container API / EC2 — chỉ bộ cân bằng tải tới được</td></tr>
    <tr><td>private (dữ liệu)</td><td>10.0.21.0/24</td><td>10.0.22.0/24</td><td>RDS PostgreSQL, Redis — chỉ tầng ứng dụng tới được</td></tr>
  </tbody>
</table>
<p>“Public” và “private” không phải ô đánh dấu trên subnet. Chúng là kết quả của bảng định tuyến gắn với subnet — đó là bài 3.2. Ở đây ta chỉ dựng sơ đồ địa chỉ. Mọi lệnh dưới đây chạy trên LocalStack 4.12 bằng AWS CLI 2.41.0 thật; trên AWS y hệt (chỉ khác ID):</p>
${OUT_31_CIDR_B}
<ul>
  <li>Tài khoản đã có sẵn một <strong>VPC mặc định</strong> <code>172.31.0.0/16</code>. AWS tạo mỗi region một cái để máy EC2 đầu tiên của người mới “chạy luôn”: các subnet mặc định của nó là public. Ổn cho năm phút thử, sai cho hệ thống thật — cơ sở dữ liệu của bạn chỉ cách Internet đúng một lỗi security group.</li>
  <li><code>AvailabilityZoneId</code> (<code>apse1-az1</code>) là vùng vật lý; tên <code>ap-southeast-1a</code> ở tài khoản khác có thể trỏ vùng vật lý khác (bài 0.3). Khi hai tài khoản phải khớp AZ, so ID.</li>
  <li>Ba lỗi là ba lan can: subnet nằm ngoài dải VPC (<code>InvalidSubnet.Range</code>), subnet chồng subnet khác (<code>InvalidSubnet.Conflict</code>), VPC lớn hơn /16 (<code>InvalidVpc.Range</code>).</li>
  <li><strong>Khác biệt của trình giả lập:</strong> LocalStack nhận subnet <code>/29</code> (8 địa chỉ, 3 dùng được). AWS thật từ chối: subnet phải từ /16 tới /28. Đừng tin trình giả lập về giới hạn — đọc tài liệu.</li>
</ul>

<h3>Nên to bao nhiêu?</h3>
<ul>
  <li><strong>VPC: /16.</strong> Không tốn đồng nào và còn chỗ cho nhiều subnet. Ghi dải vào một tài liệu “quy hoạch IP” chung để nhóm sau không dùng lại.</li>
  <li><strong>Subnet: /24 cho đa số tầng, /20 hoặc lớn hơn cho nền tảng container.</strong> ECS Fargate và EKS cấp cho mỗi task hay pod một IP riêng; /24 cạn ở 251. Hết IP lộ ra thành lỗi “không khởi chạy được task” đúng lúc tệ nhất — khi lượng truy cập tăng vọt.</li>
  <li><strong>Chừa chỗ.</strong> Đừng chia hết /16 ngay ngày đầu; giữ khối trống cho AZ và tầng mới.</li>
  <li><strong>IPv6</strong> là tuỳ chọn: AWS cấp cho VPC một /56 và mỗi subnet một /64. Bạn gặp lại nó cùng egress-only Internet gateway ở bài 3.2.</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> router cấp địa chỉ <code>192.168.1.x</code>. Nếu VPN công ty cũng dùng <code>192.168.1.0/24</code>, bạn ở nhà không in được ra máy in văn phòng — đúng bài toán trùng dải, ở quy mô căn nhà.</li>
  <li><strong>Đi làm:</strong> phiếu việc đầu tiên một kỹ sư cloud mới hay nhận là “không peering được VPC mới với VPC của nhóm dữ liệu”. Nguyên nhân gần như luôn là hai nhóm cùng chọn <code>10.0.0.0/16</code>. Sửa nghĩa là dựng lại một VPC, tức là dời mọi máy và cơ sở dữ liệu bên trong.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Subnet /24 trên AWS có bao nhiêu IP dùng được, vì sao?”</strong> — 251: 256 trừ năm địa chỉ AWS giữ (mạng, router VPC, DNS, để dành, địa chỉ cuối).</li>
  <li><strong>“Một subnet trải qua hai AZ được không?”</strong> — Không. Subnet nằm trong một AZ; tính sẵn sàng cao đến từ ít nhất hai subnet mỗi tầng ở hai AZ.</li>
  <li><strong>“Điều gì làm một subnet thành public?”</strong> — Bảng định tuyến của nó đưa <code>0.0.0.0/0</code> tới Internet gateway, và tài nguyên trong đó có IP công khai. Subnet không có cờ “public”.</li>
  <li><strong>“Vì sao phải lo trùng CIDR ngay ngày đầu?”</strong> — Peering, Transit Gateway và VPN đều cần dải không chồng nhau, mà dải chính của VPC không đổi được. Trùng là phải dựng lại.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy <code>cidr.py</code> rồi sửa để chia <code>10.20.0.0/16</code> thành các khối <code>/20</code>. Được bao nhiêu khối, mỗi khối bao nhiêu IP dùng được trên AWS?</li>
  <li>Bật LocalStack (bài 0.4), tạo VPC <code>10.20.0.0/16</code> tên <code>labflow-vpc</code> với bốn subnet /24: hai public, hai private, rải ở <code>ap-southeast-1a</code> và <code>ap-southeast-1b</code>. Gắn tag <code>Tier=public</code> hoặc <code>Tier=private</code> cho từng subnet.</li>
  <li>Cố tình gây lỗi <code>InvalidSubnet.Conflict</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>describe-subnets</code> cho thấy bốn subnet ở hai AZ, mỗi cái còn 251 địa chỉ trống, bạn giải thích được 5 địa chỉ biến mất, và đã ghi đáp án cho câu chia /20 (16 khối, mỗi khối 4.091 IP dùng được).</p>
${giai('Gợi ý: các lệnh', bash(`
python3 -c "import ipaddress as i; b=list(i.ip_network('10.20.0.0/16').subnets(new_prefix=20)); print(len(b), b[0].num_addresses-5)"
V=$(aws ec2 create-vpc --cidr-block 10.20.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=labflow-vpc}]' --query Vpc.VpcId --output text)
aws ec2 create-subnet --vpc-id $V --cidr-block 10.20.1.0/24 --availability-zone ap-southeast-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-a},{Key=Tier,Value=public}]'
# … 10.20.2.0/24 (1b, public), 10.20.11.0/24 (1a, private), 10.20.12.0/24 (1b, private)
aws ec2 create-subnet --vpc-id $V --cidr-block 10.20.1.128/25   # InvalidSubnet.Conflict`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">VPC</span><span class="v">Mạng cô lập của bạn trong một region; miễn phí; trải mọi AZ của region.</span></div>
  <div class="kv"><span class="k">CIDR /n</span><span class="v">Khối địa chỉ có n bit cố định; 2^(32−n) địa chỉ. VPC từ /16 tới /28.</span></div>
  <div class="kv"><span class="k">Subnet</span><span class="v">Lát cắt của dải VPC nằm trong đúng một AZ; /16–/28.</span></div>
  <div class="kv"><span class="k">5 IP bị giữ</span><span class="v">.0 mạng, .1 router, .2 DNS, .3 để dành, địa chỉ cuối.</span></div>
  <div class="kv"><span class="k">RFC 1918</span><span class="v">Các dải riêng 10/8, 172.16/12, 192.168/16.</span></div>
  <div class="kv"><span class="k">VPC mặc định</span><span class="v">172.31.0.0/16 với subnet mặc định public, mỗi region một cái để chạy thử nhanh.</span></div>
  <div class="kv"><span class="k">AZ ID</span><span class="v">Mã vùng vật lý (apse1-az1); tên kiểu 1a có thể khác giữa các tài khoản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>VPC là không gian địa chỉ cô lập, miễn phí, trong một region; subnet đặt từng lát của nó vào một AZ.</li>
  <li>Quy hoạch CIDR trước: VPC /16, không trùng VPC khác, văn phòng hay 172.17.0.0/16 của Docker.</li>
  <li>Mỗi subnet mất 5 địa chỉ; nền tảng container cần subnet to hơn.</li>
  <li>Hai subnet mỗi tầng ở hai AZ; “public” đến từ định tuyến, không từ một cờ.</li>
  <li>Trình giả lập có thể dễ dãi hơn AWS (LocalStack nhận /29) — giới hạn lấy từ tài liệu.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html', '🧭', 'Tài liệu AWS — Amazon VPC hoạt động thế nào', 'VPC, subnet, bảng định tuyến, gateway trong một trang.')}
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html', '📐', 'Tài liệu AWS — Khối CIDR của subnet', 'Luật /16–/28 và năm địa chỉ bị giữ.')}

<h3>Nguồn</h3>
<ul>
  <li>VPC hoạt động thế nào: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html</a></li>
  <li>Kích thước subnet, địa chỉ bị giữ: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html</a></li>
  <li>Khối CIDR của VPC (/16–/28, dải phụ): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html</a></li>
  <li>VPC mặc định: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html</a></li>
  <li>RFC 1918 — không gian địa chỉ riêng: <a href="https://www.rfc-editor.org/rfc/rfc1918" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc1918</a></li>
  <li>Mạng bridge của Docker: <a href="https://docs.docker.com/engine/network/drivers/bridge/" target="_blank" rel="noopener">docs.docker.com/engine/network/drivers/bridge/</a></li>
</ul>
</div>
`;

/* ═════ 3.2 — Bảng định tuyến và Internet gateway ═════ */
const L32_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 2</span>
<h2>3.2 — Route tables and the Internet gateway: what “public” really means</h2>
<p class="lead">In lesson 3.1 we built four subnets and called two of them “public”. Nothing about them was public yet: every subnet could only talk inside the VPC. This lesson adds the two pieces that decide where a packet may go — the <strong>route table</strong> and the <strong>Internet gateway</strong> — and shows the same idea on real Linux routing tables, so you can see a “private” machine fail to reach the Internet with your own eyes.</p>

<h3>Route tables: signposts, not walls</h3>
<ul>
  <li>A route table is a list of <em>destination → target</em>. For every packet leaving a subnet, the VPC router picks the <strong>most specific match</strong> (longest prefix): <code>10.0.0.0/16</code> beats <code>0.0.0.0/0</code> for an address inside the VPC.</li>
  <li>Every route table starts with a <strong>local route</strong> for the VPC's own CIDR. You cannot delete it, which is why every subnet of a VPC can always reach every other subnet (security groups and NACLs decide whether it is <em>allowed</em> — lesson 3.3).</li>
  <li>Each subnet is associated with <strong>exactly one</strong> route table. A subnet you never associate uses the VPC's <strong>main route table</strong>.</li>
  <li>Targets you will meet: <code>igw-</code> (Internet gateway), <code>nat-</code> (NAT gateway, 3.4), <code>vpce-</code> (gateway endpoint, 3.4), <code>pcx-</code> (peering, 3.5), <code>tgw-</code> (Transit Gateway, 3.5).</li>
</ul>

<h3>The Internet gateway</h3>
<p>An Internet gateway (IGW) is the estate's main gate. It is free, horizontally scaled and highly available by design — there is no size to choose and no bandwidth limit to worry about. One VPC has at most one IGW attached. It does two jobs: it is the target that a route can point <code>0.0.0.0/0</code> to, and it performs a one-to-one translation between an instance's <strong>public IPv4</strong> and its <strong>private IPv4</strong>. The instance itself never sees its public address: inside the machine, <code>ip addr</code> shows only <code>10.0.1.x</code>.</p>
<p>So a subnet is <strong>public</strong> when two things are true: its route table sends <code>0.0.0.0/0</code> to an IGW, <em>and</em> the resource has a public IP (auto-assigned at launch or an Elastic IP). Remove either one and the machine cannot be reached from the Internet.</p>

<h3>See it running: making two subnets public</h3>
${OUT_32_ROUTE_A}
<ul>
  <li>The first command shows the VPC's <strong>main route table</strong>: just <code>10.0.0.0/16 → local</code>. That is all a brand-new VPC knows.</li>
  <li>We did <em>not</em> add the Internet route to the main table. We created <code>rt-public</code>, added <code>0.0.0.0/0 → igw-…</code> and associated it with the two public subnets only. The private subnets stay on the main table, which has no way out.</li>
  <li><code>--map-public-ip-on-launch</code> makes new instances in the public subnets get a public IPv4 automatically. The final listing shows the four subnets: <code>True</code> only for <code>public-a</code> and <code>public-b</code>.</li>
</ul>
<div class="callout warn"><p><strong>The classic shortcut that makes everything public:</strong> adding <code>0.0.0.0/0 → igw</code> to the <em>main</em> route table. It “works” on the first try, and from then on every subnet you create — including the one you meant for the database — is public by default. The lab in 3.7 starts from exactly this shortcut and the grader catches it.</p></div>

<h3>The same idea on real Linux routing</h3>
<p>LocalStack only stores the configuration; it does not move packets. To <em>see</em> routing, we used two real Docker networks on the same machine: a normal bridge (it has a way out, like a public subnet) and an <code>--internal</code> network (no way out, like a private subnet with only the local route):</p>
${OUT_32_ROUTE_B}
<ul>
  <li>The machine on the normal network has two routes: its own <code>/24</code> and a <strong>default route</strong> (<code>default</code> = <code>0.0.0.0/0</code>) through the gateway <code>.1</code>. It fetched <code>aws.amazon.com</code> and got <code>HTTP 200</code>.</li>
  <li>The machine on the internal network has only the local route. It failed in <strong>0 ms</strong>: the kernel did not even try to send a packet, because no route matched <code>1.1.1.1</code>. That is the behaviour of a private subnet with no NAT: not “slow”, not “blocked by a firewall” — simply no road.</li>
  <li>Debugging habit: when something “cannot connect”, check the route table <em>first</em>, then security group, then NACL, then the application. Each of these fails with a different symptom: no route fails immediately; a security group drop times out (lesson 3.3).</li>
</ul>

<h3>Public IPv4 is no longer free</h3>
<p>Since <strong>1 February 2024</strong> AWS charges <strong>$0.005 per hour for every public IPv4 address</strong>, attached or idle (the Price List for Singapore shows the same $0.005 for “in-use” and “idle”). That is about $3.65 a month per address — small, but it adds up when every test machine gets one by default. Two practical rules: give public IPs only to things that must be reached directly (usually only the load balancer), and use the free <em>Public IP Insights</em> view to find forgotten ones.</p>

<h3>IPv6 and the egress-only gateway</h3>
<p>IPv6 addresses are globally unique, so there is no NAT. To let a private subnet <em>start</em> IPv6 connections outward without being reachable from outside, AWS offers an <strong>egress-only Internet gateway</strong>. It is the IPv6 counterpart of the NAT gateway in lesson 3.4, and unlike NAT it has no hourly charge.</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> your laptop has <code>192.168.1.23</code>, but websites see your provider's address. Your home router is doing the “one public address outside, private inside” job that an IGW (one-to-one) and a NAT (many-to-one) do in AWS.</li>
  <li><strong>At work:</strong> a ticket “service X cannot call the payment API” is often a subnet that was associated with the wrong route table during a Terraform change. <code>aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=&lt;id&gt;</code> answers it in one command; an empty answer means “main table”.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“What is the difference between a public and a private subnet?”</strong> — Only routing: a public subnet's route table has <code>0.0.0.0/0 → IGW</code> (and its resources have public IPs); a private subnet has no route to an IGW.</li>
  <li><strong>“Your EC2 instance has a public IP but you cannot reach it. What do you check?”</strong> — Route table of its subnet (0.0.0.0/0 → IGW?), IGW attached, security group inbound rule, NACL both directions, then the service on the machine.</li>
  <li><strong>“Why not add the IGW route to the main route table?”</strong> — Every subnet without an explicit association, including future ones, becomes public. Keep the main table private and associate public subnets explicitly.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>In your <code>labflow-vpc</code> from 3.1, create and attach an IGW, create <code>rt-public</code> with <code>0.0.0.0/0 → igw</code>, and associate it with the two public subnets.</li>
  <li>Turn on auto-assign public IP for the public subnets only.</li>
  <li>For each of the four subnets, print which route table it uses (remember: no association means the main table).</li>
  <li>On your own machine, create a Docker network with <code>--internal</code>, run <code>ip route</code> inside a container on it and try <code>curl https://1.1.1.1</code>.</li>
</ol>
<p><strong>Done when:</strong> the public subnets show a route <code>0.0.0.0/0 → igw-…</code>, the private ones resolve to the main table with only the local route, and your container on the internal network fails immediately with “Could not connect”.</p>
${giai('Hint: commands', bash(`
I=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)
aws ec2 attach-internet-gateway --vpc-id $V --internet-gateway-id $I
R=$(aws ec2 create-route-table --vpc-id $V --query RouteTable.RouteTableId --output text)
aws ec2 create-route --route-table-id $R --destination-cidr-block 0.0.0.0/0 --gateway-id $I
aws ec2 associate-route-table --route-table-id $R --subnet-id $PUBLIC_A   # rồi $PUBLIC_B
aws ec2 modify-subnet-attribute --subnet-id $PUBLIC_A --map-public-ip-on-launch
aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=$PRIVATE_A --query 'RouteTables[0].RouteTableId'
docker network create --internal thu-private && docker run --rm --network thu-private alpine ip route`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Route table</span><span class="v">Destination → target list; longest prefix wins; one per subnet.</span></div>
  <div class="kv"><span class="k">Local route</span><span class="v">VPC CIDR → local; cannot be deleted; all subnets can route to each other.</span></div>
  <div class="kv"><span class="k">Main route table</span><span class="v">Used by every subnet with no explicit association. Keep it private.</span></div>
  <div class="kv"><span class="k">Internet gateway</span><span class="v">Free, scaled gateway to the Internet; 1:1 public ↔ private IPv4 translation.</span></div>
  <div class="kv"><span class="k">Public subnet</span><span class="v">Route 0.0.0.0/0 → IGW plus public IPs on resources.</span></div>
  <div class="kv"><span class="k">Elastic IP</span><span class="v">Static public IPv4 you allocate; $0.005/hour since 1/2/2024 like any public IPv4.</span></div>
  <div class="kv"><span class="k">Egress-only IGW</span><span class="v">IPv6 outbound only; no inbound connections; no hourly charge.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Routing decides where packets may go; the local route always connects the whole VPC.</li>
  <li>Public = route to IGW + public IP. Private = no route to IGW.</li>
  <li>Never put the IGW route in the main table; associate public subnets explicitly.</li>
  <li>No route fails instantly; a firewall drop times out — the symptom tells you where to look.</li>
  <li>Every public IPv4 costs $0.005/hour since 2024; give them only to what must be public.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html', '🧭', 'AWS docs — Route tables', 'Main vs custom tables, associations, route priority.')}
${tl('https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/', '💸', 'AWS blog — Public IPv4 address charge', 'Why every public IPv4 now costs money, and how to find yours.')}

<h3>Sources</h3>
<ul>
  <li>Route tables: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html</a></li>
  <li>Internet gateways: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html</a></li>
  <li>IP addressing (public IPv4, Elastic IP): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html</a></li>
  <li>Public IPv4 charge from 01/02/2024 ($0.005/IP/hour): <a href="https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/</a></li>
  <li>VPC pricing: <a href="https://aws.amazon.com/vpc/pricing/" target="_blank" rel="noopener">aws.amazon.com/vpc/pricing/</a></li>
  <li>Docker bridge and internal networks: <a href="https://docs.docker.com/engine/network/drivers/bridge/" target="_blank" rel="noopener">docs.docker.com/engine/network/drivers/bridge/</a></li>
</ul>
</div>
`;

const L32_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 2</span>
<h2>3.2 — Bảng định tuyến và Internet gateway: “public” thật ra nghĩa là gì</h2>
<p class="lead">Ở bài 3.1 ta dựng bốn subnet và gọi hai cái là “public”. Thực ra chưa cái nào public cả: mọi subnet chỉ nói chuyện được trong VPC. Bài này thêm hai mảnh quyết định gói tin được đi đâu — <strong>bảng định tuyến</strong> và <strong>Internet gateway</strong> — rồi cho thấy cùng ý tưởng đó trên bảng định tuyến Linux thật, để bạn tận mắt thấy một máy “private” không ra được Internet.</p>

<h3>Bảng định tuyến: biển chỉ đường, không phải bức tường</h3>
<ul>
  <li>Bảng định tuyến là danh sách <em>đích → nơi chuyển tới</em>. Với mỗi gói tin rời subnet, router của VPC chọn dòng <strong>khớp cụ thể nhất</strong> (tiền tố dài nhất): <code>10.0.0.0/16</code> thắng <code>0.0.0.0/0</code> với địa chỉ nằm trong VPC.</li>
  <li>Bảng nào cũng bắt đầu bằng một <strong>route local</strong> cho chính dải CIDR của VPC. Không xoá được, nên mọi subnet trong VPC luôn tìm được đường tới nhau (security group và NACL quyết định có <em>được phép</em> hay không — bài 3.3).</li>
  <li>Mỗi subnet gắn với <strong>đúng một</strong> bảng định tuyến. Subnet bạn chưa gắn thì dùng <strong>bảng main</strong> của VPC.</li>
  <li>Các đích bạn sẽ gặp: <code>igw-</code> (Internet gateway), <code>nat-</code> (NAT gateway, 3.4), <code>vpce-</code> (gateway endpoint, 3.4), <code>pcx-</code> (peering, 3.5), <code>tgw-</code> (Transit Gateway, 3.5).</li>
</ul>

<h3>Internet gateway</h3>
<p>Internet gateway (IGW) là cổng chính của khu đô thị. Nó miễn phí, tự co giãn và sẵn sàng cao theo thiết kế — không phải chọn cỡ, không phải lo băng thông. Một VPC gắn tối đa một IGW. Nó làm hai việc: là đích để một route trỏ <code>0.0.0.0/0</code> tới, và dịch một-đổi-một giữa <strong>IPv4 công khai</strong> và <strong>IPv4 riêng</strong> của máy. Bản thân máy không bao giờ thấy địa chỉ công khai của mình: trong máy, <code>ip addr</code> chỉ hiện <code>10.0.1.x</code>.</p>
<p>Vậy một subnet là <strong>public</strong> khi đủ hai điều: bảng định tuyến của nó đưa <code>0.0.0.0/0</code> tới IGW, <em>và</em> tài nguyên có IP công khai (tự gán lúc khởi tạo hoặc Elastic IP). Thiếu một trong hai là từ Internet không tới được máy.</p>

<h3>Xem chạy thật: biến hai subnet thành public</h3>
${OUT_32_ROUTE_A}
<ul>
  <li>Lệnh đầu cho thấy <strong>bảng main</strong> của VPC: chỉ có <code>10.0.0.0/16 → local</code>. Một VPC mới tinh chỉ biết có vậy.</li>
  <li>Ta KHÔNG thêm route ra Internet vào bảng main. Ta tạo <code>rt-public</code>, thêm <code>0.0.0.0/0 → igw-…</code> rồi chỉ gắn nó với hai subnet public. Hai subnet private ở lại bảng main, không có lối ra.</li>
  <li><code>--map-public-ip-on-launch</code> làm máy mới trong subnet public tự nhận một IPv4 công khai. Danh sách cuối cho thấy bốn subnet: <code>True</code> chỉ ở <code>public-a</code> và <code>public-b</code>.</li>
</ul>
<div class="callout warn"><p><strong>Lối tắt kinh điển làm mọi thứ thành public:</strong> thêm <code>0.0.0.0/0 → igw</code> vào bảng <em>main</em>. Lần đầu nó “chạy”, và từ đó mọi subnet bạn tạo — kể cả cái định dành cho cơ sở dữ liệu — mặc định là public. Lab 3.7 bắt đầu từ đúng lối tắt này và bộ chấm bắt được.</p></div>

<h3>Cùng ý tưởng trên định tuyến Linux thật</h3>
<p>LocalStack chỉ lưu cấu hình; nó không chuyển gói tin. Để <em>thấy</em> định tuyến, ta dùng hai mạng Docker thật trên cùng một máy: một bridge thường (có lối ra, giống subnet public) và một mạng <code>--internal</code> (không lối ra, giống subnet private chỉ có route local):</p>
${OUT_32_ROUTE_B}
<ul>
  <li>Máy ở mạng thường có hai route: dải <code>/24</code> của nó và một <strong>route mặc định</strong> (<code>default</code> = <code>0.0.0.0/0</code>) qua cổng <code>.1</code>. Nó tải được <code>aws.amazon.com</code> và nhận <code>HTTP 200</code>.</li>
  <li>Máy ở mạng internal chỉ có route local. Nó thất bại sau <strong>0 ms</strong>: nhân Linux còn chưa gửi gói nào, vì không route nào khớp <code>1.1.1.1</code>. Đó chính là hành vi của subnet private không có NAT: không phải “chậm”, không phải “tường lửa chặn” — đơn giản là không có đường.</li>
  <li>Thói quen gỡ lỗi: khi thấy “không kết nối được”, xem bảng định tuyến <em>trước</em>, rồi security group, rồi NACL, rồi ứng dụng. Mỗi chỗ hỏng một kiểu: thiếu route thì hỏng ngay lập tức; security group chặn thì chờ tới hết giờ (bài 3.3).</li>
</ul>

<h3>IPv4 công khai không còn miễn phí</h3>
<p>Từ <strong>01/02/2024</strong> AWS tính <strong>0,005 USD mỗi giờ cho mỗi địa chỉ IPv4 công khai</strong>, dù đang gắn hay để không (bảng giá Singapore ghi cùng 0,005 cho “in-use” và “idle”). Khoảng 3,65 USD/tháng mỗi địa chỉ — nhỏ, nhưng cộng dồn khi mọi máy thử đều được cấp một cái theo mặc định. Hai luật thực tế: chỉ cấp IP công khai cho thứ bắt buộc phải tới thẳng (thường chỉ bộ cân bằng tải), và dùng màn hình miễn phí <em>Public IP Insights</em> để tìm địa chỉ bị bỏ quên.</p>

<h3>IPv6 và egress-only gateway</h3>
<p>Địa chỉ IPv6 là duy nhất toàn cầu nên không có NAT. Để subnet private <em>chủ động</em> mở kết nối IPv6 ra ngoài mà bên ngoài không gọi vào được, AWS có <strong>egress-only Internet gateway</strong>. Nó là bản IPv6 của NAT gateway ở bài 3.4, và khác NAT ở chỗ không tính tiền theo giờ.</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> laptop của bạn mang <code>192.168.1.23</code>, nhưng các trang web thấy địa chỉ của nhà mạng. Router ở nhà đang làm việc “một địa chỉ công khai bên ngoài, địa chỉ riêng bên trong” — trên AWS việc đó chia cho IGW (một-đổi-một) và NAT (nhiều-đổi-một).</li>
  <li><strong>Đi làm:</strong> phiếu “dịch vụ X không gọi được API thanh toán” thường là một subnet bị gắn nhầm bảng định tuyến trong một lần sửa Terraform. <code>aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=&lt;id&gt;</code> trả lời trong một lệnh; trả về rỗng nghĩa là “dùng bảng main”.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Subnet public và private khác nhau ở đâu?”</strong> — Chỉ ở định tuyến: bảng của subnet public có <code>0.0.0.0/0 → IGW</code> (và tài nguyên có IP công khai); subnet private không có route tới IGW.</li>
  <li><strong>“Máy EC2 có IP công khai mà bạn không tới được. Kiểm gì?”</strong> — Bảng định tuyến của subnet (có 0.0.0.0/0 → IGW?), IGW đã gắn chưa, luật vào của security group, NACL hai chiều, rồi dịch vụ trên máy.</li>
  <li><strong>“Vì sao không thêm route IGW vào bảng main?”</strong> — Mọi subnet không gắn bảng riêng, kể cả subnet tạo sau này, đều thành public. Giữ bảng main private và gắn bảng public một cách tường minh.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Trong <code>labflow-vpc</code> từ bài 3.1, tạo và gắn một IGW, tạo <code>rt-public</code> với <code>0.0.0.0/0 → igw</code>, gắn nó vào hai subnet public.</li>
  <li>Bật tự gán IP công khai chỉ cho hai subnet public.</li>
  <li>Với từng subnet trong bốn cái, in ra nó dùng bảng định tuyến nào (nhớ: không gắn nghĩa là dùng bảng main).</li>
  <li>Trên máy bạn, tạo một mạng Docker có <code>--internal</code>, chạy <code>ip route</code> trong một container ở mạng đó và thử <code>curl https://1.1.1.1</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> subnet public có route <code>0.0.0.0/0 → igw-…</code>, subnet private quy về bảng main chỉ có route local, và container ở mạng internal thất bại ngay với “Could not connect”.</p>
${giai('Gợi ý: các lệnh', bash(`
I=$(aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text)
aws ec2 attach-internet-gateway --vpc-id $V --internet-gateway-id $I
R=$(aws ec2 create-route-table --vpc-id $V --query RouteTable.RouteTableId --output text)
aws ec2 create-route --route-table-id $R --destination-cidr-block 0.0.0.0/0 --gateway-id $I
aws ec2 associate-route-table --route-table-id $R --subnet-id $PUBLIC_A   # rồi $PUBLIC_B
aws ec2 modify-subnet-attribute --subnet-id $PUBLIC_A --map-public-ip-on-launch
aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=$PRIVATE_A --query 'RouteTables[0].RouteTableId'
docker network create --internal thu-private && docker run --rm --network thu-private alpine ip route`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bảng định tuyến</span><span class="v">Danh sách đích → nơi chuyển; tiền tố dài nhất thắng; mỗi subnet một bảng.</span></div>
  <div class="kv"><span class="k">Route local</span><span class="v">CIDR của VPC → local; không xoá được; mọi subnet định tuyến được tới nhau.</span></div>
  <div class="kv"><span class="k">Bảng main</span><span class="v">Dùng cho mọi subnet không gắn bảng riêng. Giữ nó private.</span></div>
  <div class="kv"><span class="k">Internet gateway</span><span class="v">Cổng ra Internet miễn phí, tự co giãn; dịch IPv4 công khai ↔ riêng một-đổi-một.</span></div>
  <div class="kv"><span class="k">Subnet public</span><span class="v">Route 0.0.0.0/0 → IGW cộng IP công khai trên tài nguyên.</span></div>
  <div class="kv"><span class="k">Elastic IP</span><span class="v">IPv4 công khai cố định bạn xin; 0,005 USD/giờ từ 01/02/2024 như mọi IPv4 công khai.</span></div>
  <div class="kv"><span class="k">Egress-only IGW</span><span class="v">Chỉ IPv6 chiều ra; không nhận kết nối vào; không tính tiền theo giờ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Định tuyến quyết định gói tin được đi đâu; route local luôn nối cả VPC.</li>
  <li>Public = route tới IGW + IP công khai. Private = không có route tới IGW.</li>
  <li>Đừng bao giờ đặt route IGW ở bảng main; gắn subnet public một cách tường minh.</li>
  <li>Thiếu route thì hỏng ngay; tường lửa chặn thì chờ hết giờ — triệu chứng chỉ chỗ cần nhìn.</li>
  <li>Mỗi IPv4 công khai tốn 0,005 USD/giờ từ 2024; chỉ cấp cho thứ bắt buộc phải public.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html', '🧭', 'Tài liệu AWS — Bảng định tuyến', 'Bảng main và bảng riêng, liên kết, thứ tự ưu tiên route.')}
${tl('https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/', '💸', 'Blog AWS — Phí địa chỉ IPv4 công khai', 'Vì sao mỗi IPv4 công khai giờ tốn tiền, và cách tìm các địa chỉ của bạn.')}

<h3>Nguồn</h3>
<ul>
  <li>Bảng định tuyến: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html</a></li>
  <li>Internet gateway: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html</a></li>
  <li>Địa chỉ IP (IPv4 công khai, Elastic IP): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html</a></li>
  <li>Phí IPv4 công khai từ 01/02/2024 (0,005 USD/IP/giờ): <a href="https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/" target="_blank" rel="noopener">aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/</a></li>
  <li>Bảng giá VPC: <a href="https://aws.amazon.com/vpc/pricing/" target="_blank" rel="noopener">aws.amazon.com/vpc/pricing/</a></li>
  <li>Mạng bridge và mạng internal của Docker: <a href="https://docs.docker.com/engine/network/drivers/bridge/" target="_blank" rel="noopener">docs.docker.com/engine/network/drivers/bridge/</a></li>
</ul>
</div>
`;

/* ═════ 3.3 — Security group và NACL ═════ */
const L33_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3</span>
<h2>3.3 — Security groups and network ACLs: stateful vs stateless, seen on real packets</h2>
<p class="lead">Routing decides where a packet <em>can</em> go. Security groups and network ACLs decide whether it is <em>allowed</em>. They look similar in the console — both are lists of ports and address ranges — but they behave very differently, and the difference has a name every interviewer asks about: <strong>stateful</strong> vs <strong>stateless</strong>. In this lesson you will not just read the definition: you will watch the same web request succeed under one model and hang under the other, using real Linux packet filtering.</p>

<h3>Security group: the smart lock on each flat</h3>
<ul>
  <li>Attached to a <strong>network interface</strong> (EC2 instance, RDS, load balancer, Fargate task), not to a subnet. One interface can have several groups; the rules add up.</li>
  <li><strong>Allow rules only.</strong> Anything not allowed is denied. You cannot write “deny this IP” in a security group.</li>
  <li><strong>Stateful:</strong> if a request is allowed in, the reply is allowed out automatically, whatever the outbound rules say (and the other way round).</li>
  <li>Default for a new group: <strong>no inbound rules</strong> (nothing gets in) and <strong>one outbound rule allowing everything</strong>.</li>
  <li>A rule's source can be <strong>another security group</strong>, not only a CIDR. This is the most useful feature of all: “the database accepts 5432 only from members of the app group”, whatever IPs the app containers get tomorrow.</li>
</ul>

<h3>Network ACL: the guard at the building entrance</h3>
<ul>
  <li>Attached to a <strong>subnet</strong>; applies to every packet entering or leaving it.</li>
  <li><strong>Allow and deny rules</strong>, numbered, evaluated from the lowest number up; the <strong>first match wins</strong>; the final <code>*</code> rule (32767) denies.</li>
  <li><strong>Stateless:</strong> it does not remember connections. The reply to an allowed request is a separate packet and must be allowed by an outbound rule — usually to the client's <strong>ephemeral ports</strong>.</li>
  <li>The VPC's default NACL allows everything both ways. A custom NACL you create denies everything until you add rules.</li>
</ul>
<table>
  <thead><tr><th></th><th>Security group</th><th>Network ACL</th></tr></thead>
  <tbody>
    <tr><td>Attached to</td><td>Network interface</td><td>Subnet</td></tr>
    <tr><td>Rules</td><td>Allow only</td><td>Allow and deny</td></tr>
    <tr><td>Evaluation</td><td>All rules together</td><td>In number order, first match wins</td></tr>
    <tr><td>Return traffic</td><td>Automatic (stateful)</td><td>Needs its own rule (stateless)</td></tr>
    <tr><td>Source can be</td><td>CIDR, prefix list, another security group</td><td>CIDR only</td></tr>
    <tr><td>Typical use</td><td>Main firewall for every resource</td><td>Coarse subnet guard, blocking a bad range</td></tr>
  </tbody>
</table>

<h3>See it running: a security group chain and a NACL</h3>
<p>Three groups for LabFlow, each one only reachable from the one in front of it — the pattern you will reuse in every chapter after this:</p>
${OUT_33_SG_A}
<ul>
  <li><code>labflow-web</code> (the load balancer) accepts 443 from anywhere. <code>labflow-app</code> accepts 8080 <em>only from</em> <code>labflow-web</code>. <code>labflow-db</code> accepts 5432 <em>only from</em> <code>labflow-app</code>. No IP address appears in the last two rules.</li>
  <li>The <code>describe-security-groups</code> output shows the db group: inbound 5432 from a group ID, outbound <code>-1</code> (all protocols) to <code>0.0.0.0/0</code> — the default outbound rule.</li>
  <li>The default NACL: rule 100 allows everything in and out, rule 32767 denies the rest. That is why most teams never notice NACLs exist.</li>
  <li>The custom NACL shows the numbering: rule 90 denies a whole range (<code>203.0.113.0/24</code>, a documentation range standing in for an attacker) <em>before</em> rule 100 allows HTTPS. And because the NACL is stateless, there is an outbound rule for ports 1024–65535: without it, every HTTPS reply would be dropped.</li>
</ul>

<h3>Stateful vs stateless on real packets</h3>
<p>LocalStack stores rules but does not filter packets. So we reproduced both models with <strong>iptables</strong> inside a real container: a web server <code>10.143.50.10</code> (port 80) and a client <code>10.143.50.20</code> on the same Docker network. Both policies are “drop everything by default”, exactly like AWS:</p>
${OUT_33_SG_B}
<ul>
  <li><strong>(A) Security-group model.</strong> Inbound allows port 80. Outbound allows <em>nothing</em> except packets belonging to a connection that is already open (<code>conntrack ESTABLISHED</code>). The request succeeds: the reply is recognised as part of the connection. That “memory” is what <em>stateful</em> means — AWS does it for you on every security group.</li>
  <li>Port 22 was not allowed: the client waited the full 4 seconds and gave up (<code>timed out</code>). A dropped packet produces <strong>silence</strong>, not an error — compare with the instant failure of a missing route in 3.2.</li>
  <li><strong>(B) NACL model.</strong> Same inbound rule, no memory. The request reached the server, the server answered, and the answer died at the outbound policy: <code>policy DROP 7 packets</code> are the server's SYN-ACK and its retries.</li>
  <li>The client sent from a random port in <code>32768–60999</code> (Linux's ephemeral range). Allowing outbound from source port 80 to destination ports <code>1024–65535</code> fixed it. AWS recommends 1024–65535 in NACLs because clients differ: Windows uses 49152–65535, NAT gateways and load balancers use 1024–65535.</li>
</ul>

<h3>Rules of thumb for production</h3>
<ul>
  <li>Security groups do 95% of the work. Reference groups, not IPs, between tiers.</li>
  <li>Never open <strong>22 (SSH), 3389 (RDP), 5432 (PostgreSQL), 3306 (MySQL), 6379 (Redis), 27017 (MongoDB)</strong> to <code>0.0.0.0/0</code>. If a human needs a shell, use Session Manager (lesson 3.6).</li>
  <li>Use NACLs for coarse, subnet-wide decisions: blocking a hostile range quickly, or a strict “the data subnets accept only the app subnets” layer. Remember the ephemeral ports.</li>
  <li>Let a machine guard it: the AWS Config managed rule <code>restricted-ssh</code> flags any security group that allows SSH from everywhere.</li>
  <li>Coming from a VPS: <code>ufw</code>/<code>iptables</code> runs <em>on</em> the machine, so whoever takes over the machine can switch it off. A security group sits outside the machine. Also beware: Docker's published ports (<code>-p 5432:5432</code>) insert their own iptables rules and are <strong>not filtered by ufw</strong> — Docker's own documentation warns about it.</li>
</ul>

<h3>🔓 Hacker's view: how fast an open port is found</h3>
<p>Palo Alto Networks Unit 42 published a study on <strong>22 November 2021</strong>: they deployed <strong>320 honeypots</strong> in public clouds exposing SSH, RDP, SMB and PostgreSQL. <strong>80% were compromised within 24 hours</strong> and all of them within a week. SSH was the most attacked service — one SSH honeypot was compromised 169 times in a single day. One threat actor compromised <strong>96% of the 80 PostgreSQL honeypots worldwide within 30 seconds</strong>. A security group rule “5432 from 0.0.0.0/0, just for testing tonight” gives you less than a minute.</p>
<p><strong>Defence:</strong> databases in private subnets with a security group that references the app group; no SSH from the Internet; Config rule <code>restricted-ssh</code>; review security groups in every pull request (lesson 11 shows how Terraform makes that easy).</p>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> a security group is like a building whose doorman lets your guest leave without checking because he remembers letting them in. A NACL is a checkpoint that checks everyone going out too, even people it just let in.</li>
  <li><strong>At work:</strong> “the health check fails only in production” is often a NACL someone added for compliance without the ephemeral-port outbound rule. The symptom is a timeout, never an error message.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“Security group vs NACL?”</strong> — SG: interface level, allow only, stateful, all rules evaluated, can reference other SGs. NACL: subnet level, allow and deny, stateless, numbered rules, first match wins.</li>
  <li><strong>“You allowed 443 inbound in a NACL but HTTPS still hangs. Why?”</strong> — The NACL is stateless; add an outbound rule to the client's ephemeral ports (1024–65535).</li>
  <li><strong>“How do you let only the API reach the database without hard-coding IPs?”</strong> — Inbound rule on the DB security group with the API security group as the source.</li>
  <li><strong>“Can you block one malicious IP with a security group?”</strong> — No, SGs have no deny. Use a NACL deny rule with a lower number, or AWS WAF in front of the load balancer (chapter 5).</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>In <code>labflow-vpc</code>, create the chain <code>labflow-alb</code> (443 from anywhere) → <code>labflow-app</code> (8080 from alb) → <code>labflow-db</code> (5432 from app).</li>
  <li>Create a custom NACL with: deny all TCP from <code>203.0.113.0/24</code> (rule 90), allow 443 in (100), allow 1024–65535 out (100). List the entries.</li>
  <li>Reproduce the stateless failure: two containers on one Docker network, <code>--cap-add NET_ADMIN</code> on the server, policy DROP both ways, allow only inbound 80, then fix it with an outbound ephemeral rule.</li>
</ol>
<p><strong>Done when:</strong> <code>labflow-db</code> has exactly one inbound rule whose source is the app group's ID, your NACL lists rule 90 before rule 100, and you have seen a timeout turn into a successful response by adding one outbound rule.</p>
${giai('Hint: commands', bash(`
A=$(aws ec2 create-security-group --group-name labflow-app --description app --vpc-id $V --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $DB --protocol tcp --port 5432 --source-group $A
N=$(aws ec2 create-network-acl --vpc-id $V --query NetworkAcl.NetworkAclId --output text)
aws ec2 create-network-acl-entry --network-acl-id $N --ingress --rule-number 90 --protocol tcp \\
  --port-range From=0,To=65535 --cidr-block 203.0.113.0/24 --rule-action deny
# Container máy chủ (cần iptables):
iptables -P INPUT DROP; iptables -P OUTPUT DROP; iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 --dport 1024:65535 -j ACCEPT   # dòng sửa`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Security group</span><span class="v">Stateful allow-list on a network interface.</span></div>
  <div class="kv"><span class="k">Network ACL</span><span class="v">Stateless numbered allow/deny list on a subnet.</span></div>
  <div class="kv"><span class="k">Stateful</span><span class="v">Remembers connections; replies are allowed automatically.</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">Judges every packet alone; replies need their own rule.</span></div>
  <div class="kv"><span class="k">Ephemeral ports</span><span class="v">Client's temporary source ports; allow 1024–65535 for NACL replies.</span></div>
  <div class="kv"><span class="k">SG reference</span><span class="v">Rule source = another security group instead of a CIDR.</span></div>
  <div class="kv"><span class="k">restricted-ssh</span><span class="v">AWS Config managed rule flagging SSH open to the world.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Security groups: per interface, allow only, stateful, can reference each other — your main firewall.</li>
  <li>NACLs: per subnet, ordered allow/deny, stateless — remember ephemeral ports for replies.</li>
  <li>Chain tiers by group reference: web → app → db, no IPs.</li>
  <li>Dropped packets mean timeouts; missing routes mean instant failure.</li>
  <li>Open database or SSH ports are found in seconds (Unit 42: 96% of Postgres honeypots in 30 s).</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html', '🛡️', 'AWS docs — Compare security groups and network ACLs', 'The official side-by-side table.')}
${tl('https://unit42.paloaltonetworks.com/exposed-services-public-clouds/', '🍯', 'Unit 42 — Attacks against exposed services in public clouds', '320 honeypots, 80% compromised in 24 hours.')}

<h3>Sources</h3>
<ul>
  <li>Security groups: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html</a></li>
  <li>Security group rules (referencing groups): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html</a></li>
  <li>Network ACLs: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html</a></li>
  <li>Ephemeral ports: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/nacl-ephemeral-ports.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/nacl-ephemeral-ports.html</a></li>
  <li>Comparison table: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html</a></li>
  <li>Unit 42 honeypot study (22/11/2021): <a href="https://unit42.paloaltonetworks.com/exposed-services-public-clouds/" target="_blank" rel="noopener">unit42.paloaltonetworks.com/exposed-services-public-clouds/</a></li>
  <li>AWS Config rule restricted-ssh: <a href="https://docs.aws.amazon.com/config/latest/developerguide/restricted-ssh.html" target="_blank" rel="noopener">docs.aws.amazon.com/config/latest/developerguide/restricted-ssh.html</a></li>
  <li>Docker and ufw: <a href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">docs.docker.com/engine/network/packet-filtering-firewalls/</a></li>
</ul>
</div>
`;

const L33_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3</span>
<h2>3.3 — Security group và network ACL: stateful và stateless, xem trên gói tin thật</h2>
<p class="lead">Định tuyến quyết định gói tin <em>có thể</em> đi đâu. Security group và network ACL quyết định nó có <em>được phép</em> hay không. Trên console chúng trông giống nhau — đều là danh sách cổng và dải địa chỉ — nhưng hành xử rất khác, và khác biệt đó có tên mà phỏng vấn viên nào cũng hỏi: <strong>stateful</strong> và <strong>stateless</strong>. Bài này không chỉ đọc định nghĩa: bạn sẽ nhìn cùng một yêu cầu web thành công dưới mô hình này và treo dưới mô hình kia, bằng bộ lọc gói tin Linux thật.</p>

<h3>Security group: khoá thông minh của từng căn hộ</h3>
<ul>
  <li>Gắn vào <strong>giao diện mạng</strong> (máy EC2, RDS, bộ cân bằng tải, task Fargate), không gắn vào subnet. Một giao diện có thể mang nhiều group; luật cộng dồn.</li>
  <li><strong>Chỉ có luật cho phép.</strong> Thứ gì không được cho phép là bị từ chối. Không viết được “chặn IP này” trong security group.</li>
  <li><strong>Stateful:</strong> một yêu cầu được cho vào thì câu trả lời tự được cho ra, bất kể luật chiều ra ghi gì (và ngược lại).</li>
  <li>Mặc định của group mới: <strong>không có luật vào</strong> (không gì vào được) và <strong>một luật ra cho phép tất cả</strong>.</li>
  <li>Nguồn của một luật có thể là <strong>một security group khác</strong>, không chỉ CIDR. Đây là tính năng đáng giá nhất: “cơ sở dữ liệu chỉ nhận 5432 từ thành viên group app”, mai container app đổi IP gì cũng vậy.</li>
</ul>

<h3>Network ACL: bảo vệ ở sảnh toà nhà</h3>
<ul>
  <li>Gắn vào <strong>subnet</strong>; áp lên mọi gói tin vào hay ra subnet đó.</li>
  <li><strong>Có luật cho phép và luật từ chối</strong>, đánh số, xét từ số nhỏ lên; <strong>dòng khớp đầu tiên thắng</strong>; dòng <code>*</code> cuối cùng (32767) từ chối.</li>
  <li><strong>Stateless:</strong> không nhớ kết nối. Câu trả lời cho một yêu cầu đã được cho phép là một gói tin riêng, phải được một luật chiều ra cho phép — thường là tới <strong>cổng tạm</strong> (ephemeral port) của máy khách.</li>
  <li>NACL mặc định của VPC cho phép tất cả hai chiều. NACL tự tạo thì từ chối tất cả cho tới khi bạn thêm luật.</li>
</ul>
<table>
  <thead><tr><th></th><th>Security group</th><th>Network ACL</th></tr></thead>
  <tbody>
    <tr><td>Gắn vào</td><td>Giao diện mạng</td><td>Subnet</td></tr>
    <tr><td>Luật</td><td>Chỉ cho phép</td><td>Cho phép và từ chối</td></tr>
    <tr><td>Cách xét</td><td>Mọi luật cùng lúc</td><td>Theo số thứ tự, khớp đầu tiên thắng</td></tr>
    <tr><td>Gói trả lời</td><td>Tự động (stateful)</td><td>Cần luật riêng (stateless)</td></tr>
    <tr><td>Nguồn có thể là</td><td>CIDR, prefix list, security group khác</td><td>Chỉ CIDR</td></tr>
    <tr><td>Dùng điển hình</td><td>Tường lửa chính cho mọi tài nguyên</td><td>Rào thô cho cả subnet, chặn một dải xấu</td></tr>
  </tbody>
</table>

<h3>Xem chạy thật: chuỗi security group và một NACL</h3>
<p>Ba group cho LabFlow, mỗi group chỉ nhận từ group đứng trước nó — khuôn mẫu bạn sẽ dùng lại ở mọi chương sau:</p>
${OUT_33_SG_A}
<ul>
  <li><code>labflow-web</code> (bộ cân bằng tải) nhận 443 từ mọi nơi. <code>labflow-app</code> nhận 8080 <em>chỉ từ</em> <code>labflow-web</code>. <code>labflow-db</code> nhận 5432 <em>chỉ từ</em> <code>labflow-app</code>. Hai luật sau không có địa chỉ IP nào.</li>
  <li>Output <code>describe-security-groups</code> cho thấy group db: vào 5432 từ một mã group, ra <code>-1</code> (mọi giao thức) tới <code>0.0.0.0/0</code> — luật ra mặc định.</li>
  <li>NACL mặc định: luật 100 cho mọi thứ vào và ra, luật 32767 từ chối phần còn lại. Vì thế đa số nhóm không bao giờ để ý NACL tồn tại.</li>
  <li>NACL tự tạo cho thấy cách đánh số: luật 90 từ chối cả một dải (<code>203.0.113.0/24</code>, dải dành cho tài liệu, đóng vai kẻ tấn công) <em>trước</em> luật 100 cho HTTPS. Và vì NACL stateless nên có một luật chiều ra cho cổng 1024–65535: thiếu nó, mọi câu trả lời HTTPS đều bị vứt.</li>
</ul>

<h3>Stateful và stateless trên gói tin thật</h3>
<p>LocalStack lưu luật nhưng không lọc gói tin. Nên ta dựng lại cả hai mô hình bằng <strong>iptables</strong> trong một container thật: máy chủ web <code>10.143.50.10</code> (cổng 80) và máy khách <code>10.143.50.20</code> trên cùng một mạng Docker. Cả hai chính sách đều “mặc định vứt hết”, đúng như AWS:</p>
${OUT_33_SG_B}
<ul>
  <li><strong>(A) Mô hình security group.</strong> Chiều vào cho cổng 80. Chiều ra <em>không cho gì cả</em> ngoài gói thuộc một kết nối đã mở (<code>conntrack ESTABLISHED</code>). Yêu cầu thành công: câu trả lời được nhận ra là thuộc kết nối. Cái “trí nhớ” đó chính là <em>stateful</em> — AWS làm sẵn cho bạn ở mọi security group.</li>
  <li>Cổng 22 không được cho phép: máy khách chờ đủ 4 giây rồi bỏ cuộc (<code>timed out</code>). Gói bị vứt sinh ra <strong>im lặng</strong>, không sinh lỗi — so với thất bại tức thì khi thiếu route ở bài 3.2.</li>
  <li><strong>(B) Mô hình NACL.</strong> Cùng luật vào, không có trí nhớ. Yêu cầu tới được máy chủ, máy chủ trả lời, và câu trả lời chết ở chính sách chiều ra: <code>policy DROP 7 packets</code> là gói SYN-ACK của máy chủ cùng các lần gửi lại.</li>
  <li>Máy khách gửi từ một cổng ngẫu nhiên trong <code>32768–60999</code> (dải cổng tạm của Linux). Cho chiều ra từ cổng nguồn 80 tới cổng đích <code>1024–65535</code> là sửa xong. AWS khuyên dùng 1024–65535 trong NACL vì mỗi loại máy khách một kiểu: Windows dùng 49152–65535, NAT gateway và bộ cân bằng tải dùng 1024–65535.</li>
</ul>

<h3>Luật ngón tay cái khi chạy thật</h3>
<ul>
  <li>Security group làm 95% công việc. Giữa các tầng, tham chiếu group, không ghi IP.</li>
  <li>Không bao giờ mở <strong>22 (SSH), 3389 (RDP), 5432 (PostgreSQL), 3306 (MySQL), 6379 (Redis), 27017 (MongoDB)</strong> cho <code>0.0.0.0/0</code>. Người cần vào máy thì dùng Session Manager (bài 3.6).</li>
  <li>Dùng NACL cho quyết định thô cấp subnet: chặn nhanh một dải thù địch, hoặc một lớp nghiêm “subnet dữ liệu chỉ nhận từ subnet ứng dụng”. Nhớ cổng tạm.</li>
  <li>Để máy canh hộ: luật quản lý sẵn của AWS Config tên <code>restricted-ssh</code> đánh dấu mọi security group cho SSH từ khắp nơi.</li>
  <li>Từ VPS sang: <code>ufw</code>/<code>iptables</code> chạy <em>trên</em> máy, nên ai chiếm được máy là tắt được nó. Security group nằm ngoài máy. Thêm một bẫy: cổng Docker công bố (<code>-p 5432:5432</code>) tự chèn luật iptables riêng và <strong>không bị ufw lọc</strong> — chính tài liệu Docker cảnh báo điều này.</li>
</ul>

<h3>🔓 Góc hacker: cổng mở bị tìm ra nhanh tới mức nào</h3>
<p>Palo Alto Networks Unit 42 công bố một nghiên cứu ngày <strong>22/11/2021</strong>: họ đặt <strong>320 honeypot</strong> trên các cloud công cộng, mở SSH, RDP, SMB và PostgreSQL. <strong>80% bị chiếm trong 24 giờ</strong>, và tất cả bị chiếm trong một tuần. SSH bị tấn công nhiều nhất — một honeypot SSH bị chiếm 169 lần trong một ngày. Một nhóm tấn công chiếm <strong>96% trong 80 honeypot PostgreSQL trên toàn cầu chỉ trong 30 giây</strong>. Một luật security group “5432 từ 0.0.0.0/0, để thử tối nay thôi” cho bạn chưa tới một phút.</p>
<p><strong>Cách phòng:</strong> cơ sở dữ liệu ở subnet private với security group tham chiếu group app; không SSH từ Internet; luật Config <code>restricted-ssh</code>; soát security group trong mọi pull request (chương 11 cho thấy Terraform làm việc đó dễ thế nào).</p>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> security group giống toà nhà có bác bảo vệ cho khách của bạn ra về không cần hỏi, vì bác nhớ đã cho họ vào. NACL là trạm kiểm soát hỏi cả người đi ra, kể cả người vừa được cho vào.</li>
  <li><strong>Đi làm:</strong> “health check chỉ hỏng trên production” thường là một NACL ai đó thêm cho đủ chuẩn tuân thủ mà quên luật chiều ra cho cổng tạm. Triệu chứng luôn là chờ hết giờ, không bao giờ là một thông báo lỗi.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Security group khác NACL thế nào?”</strong> — SG: cấp giao diện mạng, chỉ cho phép, stateful, xét mọi luật, tham chiếu được SG khác. NACL: cấp subnet, có cho phép và từ chối, stateless, luật đánh số, khớp đầu tiên thắng.</li>
  <li><strong>“Bạn cho 443 chiều vào trong NACL mà HTTPS vẫn treo. Vì sao?”</strong> — NACL stateless; thêm luật chiều ra tới cổng tạm của máy khách (1024–65535).</li>
  <li><strong>“Làm sao chỉ cho API vào cơ sở dữ liệu mà không ghi cứng IP?”</strong> — Luật vào ở security group của DB với nguồn là security group của API.</li>
  <li><strong>“Chặn một IP độc hại bằng security group được không?”</strong> — Không, SG không có từ chối. Dùng luật deny của NACL với số nhỏ hơn, hoặc AWS WAF trước bộ cân bằng tải (chương 5).</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Trong <code>labflow-vpc</code>, tạo chuỗi <code>labflow-alb</code> (443 từ mọi nơi) → <code>labflow-app</code> (8080 từ alb) → <code>labflow-db</code> (5432 từ app).</li>
  <li>Tạo một NACL riêng: từ chối mọi TCP từ <code>203.0.113.0/24</code> (luật 90), cho 443 vào (100), cho 1024–65535 ra (100). Liệt kê các dòng.</li>
  <li>Tái hiện thất bại stateless: hai container trên một mạng Docker, máy chủ có <code>--cap-add NET_ADMIN</code>, chính sách DROP hai chiều, chỉ cho vào cổng 80, rồi sửa bằng một luật chiều ra cho cổng tạm.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>labflow-db</code> có đúng một luật vào với nguồn là mã group app, NACL của bạn liệt kê luật 90 trước luật 100, và bạn đã thấy một lần chờ hết giờ biến thành câu trả lời thành công chỉ nhờ thêm một luật chiều ra.</p>
${giai('Gợi ý: các lệnh', bash(`
A=$(aws ec2 create-security-group --group-name labflow-app --description app --vpc-id $V --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $DB --protocol tcp --port 5432 --source-group $A
N=$(aws ec2 create-network-acl --vpc-id $V --query NetworkAcl.NetworkAclId --output text)
aws ec2 create-network-acl-entry --network-acl-id $N --ingress --rule-number 90 --protocol tcp \\
  --port-range From=0,To=65535 --cidr-block 203.0.113.0/24 --rule-action deny
# Container máy chủ (cần iptables):
iptables -P INPUT DROP; iptables -P OUTPUT DROP; iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 --dport 1024:65535 -j ACCEPT   # dòng sửa`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Security group</span><span class="v">Danh sách cho phép stateful trên một giao diện mạng.</span></div>
  <div class="kv"><span class="k">Network ACL</span><span class="v">Danh sách cho phép/từ chối đánh số, stateless, trên một subnet.</span></div>
  <div class="kv"><span class="k">Stateful</span><span class="v">Nhớ kết nối; câu trả lời tự được cho qua.</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">Xét từng gói riêng lẻ; câu trả lời cần luật riêng.</span></div>
  <div class="kv"><span class="k">Cổng tạm</span><span class="v">Cổng nguồn tạm thời của máy khách; cho 1024–65535 để NACL trả lời được.</span></div>
  <div class="kv"><span class="k">Tham chiếu SG</span><span class="v">Nguồn của luật là một security group khác thay vì CIDR.</span></div>
  <div class="kv"><span class="k">restricted-ssh</span><span class="v">Luật quản lý sẵn của AWS Config đánh dấu SSH mở cho cả thế giới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Security group: theo giao diện, chỉ cho phép, stateful, tham chiếu được nhau — tường lửa chính.</li>
  <li>NACL: theo subnet, cho phép/từ chối có thứ tự, stateless — nhớ cổng tạm cho gói trả lời.</li>
  <li>Xâu chuỗi các tầng bằng tham chiếu group: web → app → db, không ghi IP.</li>
  <li>Gói bị vứt nghĩa là chờ hết giờ; thiếu route nghĩa là hỏng ngay.</li>
  <li>Cổng cơ sở dữ liệu hay SSH để mở bị tìm thấy trong vài giây (Unit 42: 96% honeypot Postgres trong 30 giây).</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html', '🛡️', 'Tài liệu AWS — So sánh security group và network ACL', 'Bảng đối chiếu chính thức.')}
${tl('https://unit42.paloaltonetworks.com/exposed-services-public-clouds/', '🍯', 'Unit 42 — Tấn công vào dịch vụ để mở trên cloud công cộng', '320 honeypot, 80% bị chiếm trong 24 giờ.')}

<h3>Nguồn</h3>
<ul>
  <li>Security group: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html</a></li>
  <li>Luật security group (tham chiếu group): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html</a></li>
  <li>Network ACL: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html</a></li>
  <li>Cổng tạm: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/nacl-ephemeral-ports.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/nacl-ephemeral-ports.html</a></li>
  <li>Bảng so sánh: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html</a></li>
  <li>Nghiên cứu honeypot của Unit 42 (22/11/2021): <a href="https://unit42.paloaltonetworks.com/exposed-services-public-clouds/" target="_blank" rel="noopener">unit42.paloaltonetworks.com/exposed-services-public-clouds/</a></li>
  <li>Luật AWS Config restricted-ssh: <a href="https://docs.aws.amazon.com/config/latest/developerguide/restricted-ssh.html" target="_blank" rel="noopener">docs.aws.amazon.com/config/latest/developerguide/restricted-ssh.html</a></li>
  <li>Docker và ufw: <a href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">docs.docker.com/engine/network/packet-filtering-firewalls/</a></li>
</ul>
</div>
`;

/* ═════ 3.4 — NAT gateway và VPC endpoint ═════ */
const L34_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 4</span>
<h2>3.4 — NAT gateways and VPC endpoints: letting private machines out, and paying for it</h2>
<p class="lead">Your API containers sit in private subnets, as they should. But they still need to go <em>out</em>: download npm or Maven packages, pull images, call a payment API, send email, read S3. A private subnet has no road to the Internet (lesson 3.2). This lesson builds the two ways out — a <strong>NAT gateway</strong> for the Internet and <strong>VPC endpoints</strong> for AWS services — shows NAT on real packets, and does the cost arithmetic that surprises almost every team in its first AWS bill.</p>

<h3>NAT gateway: the estate's mail room</h3>
<ul>
  <li>NAT = Network Address Translation. Many private machines go out through <strong>one public address</strong>; outside servers see the NAT's address, never the private ones.</li>
  <li>It is <strong>one-way</strong>: private machines can start connections out and receive the replies; nobody outside can start a connection in.</li>
  <li>A public NAT gateway lives in a <strong>public subnet</strong>, has an <strong>Elastic IP</strong>, and the private subnets' route table points <code>0.0.0.0/0</code> to it.</li>
  <li>It is <strong>zonal</strong>: it lives in one AZ. If that AZ fails, private subnets in other AZs that route through it lose Internet access. The production pattern is one NAT gateway per AZ, each private subnet routing to the NAT in its own AZ. (AWS also documents a newer <em>regional</em> NAT gateway mode that expands across AZs automatically.)</li>
  <li>It is <strong>managed</strong>: no patching, scales to high bandwidth. The alternative “NAT instance” (a small EC2 doing NAT) is cheaper but you maintain it.</li>
</ul>

<h3>See it running: NAT, private route table and an S3 endpoint</h3>
${OUT_34_NAT_A}
<ul>
  <li><code>allocate-address</code> reserved an Elastic IP; <code>create-nat-gateway</code> put the NAT in <code>public-a</code> with it. LocalStack invents the addresses; on AWS the public IP is a real one you will be billed for.</li>
  <li>A new <code>rt-private</code> table sends <code>0.0.0.0/0</code> to the NAT, and both private subnets use it.</li>
  <li>The S3 <strong>gateway endpoint</strong> added a third route automatically: destination <code>pl-…</code> (an AWS-managed <em>prefix list</em> holding every S3 address range in the region), target <code>vpce-…</code>. Longest prefix wins, so S3 traffic takes the endpoint and everything else takes the NAT.</li>
</ul>

<h3>NAT on real packets: who does the server see?</h3>
<p>Again we used real Linux networking: a private network <code>10.143.1.0/24</code> and a pretend Internet <code>10.143.200.0/24</code>, both isolated, with an nginx server at <code>10.143.200.10</code>. A third container with one leg in each network plays the NAT gateway, using the same kernel feature AWS uses conceptually: IP forwarding plus <code>MASQUERADE</code>.</p>
${OUT_34_NAT_B}
<ul>
  <li>Before: the private machine has only its local route and fails in 0 ms — no road.</li>
  <li>The NAT box has two addresses, one in each network, and <code>ip_forward = 1</code>. One iptables rule rewrites the source address of anything leaving towards the “Internet”.</li>
  <li>After adding <code>default via 10.143.1.254</code> (exactly what <code>0.0.0.0/0 → nat-…</code> does in a route table), the request succeeds.</li>
  <li><strong>The server's log shows <code>10.143.200.254</code></strong> — the NAT's address — not <code>10.143.1.10</code>. That is why third-party APIs ask you to whitelist “your NAT gateway's Elastic IP”: it is the only address they will ever see.</li>
  <li>The MASQUERADE counter shows the one connection it translated. And the server could not open a connection back to the private machine (<code>Network unreachable</code>): NAT gives an exit, not an entrance.</li>
</ul>

<h3>The cost arithmetic (Singapore, price list of 17/11/2026)</h3>
<table>
  <thead><tr><th>Item</th><th>Price</th><th>Per month</th></tr></thead>
  <tbody>
    <tr><td>NAT gateway, per hour</td><td>$0.059</td><td>730 h × 0.059 = <strong>$43.07</strong> per NAT, even if idle</td></tr>
    <tr><td>NAT data processed</td><td>$0.059 / GB</td><td>200 GB = $11.80 (plus normal data transfer out)</td></tr>
    <tr><td>Elastic IP (public IPv4)</td><td>$0.005 / hour</td><td>$3.65</td></tr>
    <tr><td>Gateway endpoint (S3, DynamoDB)</td><td>free</td><td>$0 — and S3 traffic no longer pays NAT processing</td></tr>
    <tr><td>Interface endpoint, per AZ</td><td>$0.013 / hour + $0.01 / GB</td><td>730 × 0.013 = $9.49 per endpoint per AZ</td></tr>
  </tbody>
</table>
<ul>
  <li>Two AZs “done properly” = two NAT gateways = <strong>about $86 a month before a single byte</strong> — more than the small RDS and the containers of a student project together. This is the line item that shocks people.</li>
  <li>The S3 gateway endpoint is free and removes NAT processing for S3 traffic. If 150 of those 200 GB were image uploads to S3, it saves 150 × 0.059 = $8.85 a month for zero effort. Always add it.</li>
  <li>Interface endpoints are <em>not</em> automatically cheaper. A Fargate service in private subnets typically needs ECR (two endpoints: <code>api</code> and <code>dkr</code>), CloudWatch Logs and Secrets Manager: 4 endpoints × 2 AZs × $9.49 = <strong>$75.92</strong> a month — more than one NAT gateway. Choose them for security (traffic never leaves AWS's network, endpoint policies) or for very high volume, not by reflex.</li>
  <li>For a lab or a demo: no NAT at all. Put nothing in private subnets that needs the Internet, or use the free gateway endpoints only. The lab in 3.7 is built that way.</li>
</ul>

<h3>VPC endpoints in one page</h3>
<ul>
  <li><strong>Gateway endpoint</strong> — only for <strong>S3 and DynamoDB</strong>. A route-table entry (prefix list → <code>vpce-</code>). Free. Works only from inside the VPC's own subnets.</li>
  <li><strong>Interface endpoint</strong> (AWS PrivateLink) — for most other services (ECR, SSM, Secrets Manager, CloudWatch, STS…) and for services sold by other companies. It creates a network interface with a private IP in your subnet; with private DNS on, the normal service hostname resolves to that private IP, so your code does not change.</li>
  <li><strong>Endpoint policies</strong> add a resource-side lock: “this endpoint may only reach the bucket <code>labflow-anh</code>”. Combined with a bucket policy condition <code>aws:SourceVpce</code> (chapter 2), a stolen key is useless from outside your VPC.</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>At home:</strong> every phone in your house shares one public address from your Internet provider. A website can see “someone from this house” but cannot call your phone directly — your home router is a NAT.</li>
  <li><strong>At work:</strong> a classic first-month finding is a NAT gateway left in a forgotten dev VPC, $43 a month for nothing, or a nightly job copying terabytes from S3 through the NAT instead of a gateway endpoint. Cost reviews start with <code>describe-nat-gateways</code> in every region (the “what is still billing?” script in 3.7 does it).</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How do instances in a private subnet download updates?”</strong> — Route <code>0.0.0.0/0</code> to a NAT gateway in a public subnet (one per AZ for high availability); outbound only.</li>
  <li><strong>“NAT gateway vs Internet gateway?”</strong> — IGW: free, two-way, one-to-one for resources with public IPs. NAT: paid hourly and per GB, many-to-one, outbound only, for private resources.</li>
  <li><strong>“How do you cut the NAT bill for S3 traffic?”</strong> — Add a free S3 gateway endpoint to the private route tables; S3 traffic takes the endpoint route.</li>
  <li><strong>“Gateway vs interface endpoint?”</strong> — Gateway: S3/DynamoDB only, route-table entry, free. Interface: ENI with private IP via PrivateLink, many services, hourly + per GB.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>On LocalStack: allocate an Elastic IP, create a NAT gateway in <code>public-a</code>, create <code>rt-private</code> with <code>0.0.0.0/0 → nat</code>, associate both private subnets.</li>
  <li>Add an S3 gateway endpoint to <code>rt-private</code> and list its routes. Which route will traffic to S3 take, and why?</li>
  <li>Work out the monthly cost of your design with two NAT gateways and 300 GB through them, then with an S3 endpoint carrying 250 GB of it.</li>
  <li>Clean up: delete the NAT gateway and <strong>release</strong> the Elastic IP (an unattached EIP still costs money).</li>
</ol>
<p><strong>Done when:</strong> <code>rt-private</code> shows three routes (local, <code>0.0.0.0/0 → nat-</code>, <code>pl- → vpce-</code>), your cost answer is 2 × 43.07 + 300 × 0.059 = $103.84 before and $89.09 after the endpoint (plus the EIPs), and <code>describe-addresses</code> is empty.</p>
${giai('Hint: commands', bash(`
E=$(aws ec2 allocate-address --domain vpc --query AllocationId --output text)
N=$(aws ec2 create-nat-gateway --subnet-id $PUBLIC_A --allocation-id $E --query NatGateway.NatGatewayId --output text)
aws ec2 create-route --route-table-id $RT_PRIVATE --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $N
aws ec2 create-vpc-endpoint --vpc-id $V --vpc-endpoint-type Gateway \\
  --service-name com.amazonaws.ap-southeast-1.s3 --route-table-ids $RT_PRIVATE
# dọn: NAT trước, rồi mới trả EIP
aws ec2 delete-nat-gateway --nat-gateway-id $N
aws ec2 release-address --allocation-id $E`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NAT gateway</span><span class="v">Managed many-to-one outbound translation; zonal; $0.059/h + $0.059/GB (Singapore).</span></div>
  <div class="kv"><span class="k">MASQUERADE</span><span class="v">Linux NAT rule that rewrites the source to the outgoing interface's address.</span></div>
  <div class="kv"><span class="k">Elastic IP</span><span class="v">Static public IPv4; billed hourly whether attached or not.</span></div>
  <div class="kv"><span class="k">Gateway endpoint</span><span class="v">Free route to S3/DynamoDB through a managed prefix list.</span></div>
  <div class="kv"><span class="k">Interface endpoint</span><span class="v">PrivateLink ENI with a private IP for an AWS service; $0.013/h per AZ.</span></div>
  <div class="kv"><span class="k">Prefix list</span><span class="v">Named set of CIDRs (pl-…) usable in routes and security groups.</span></div>
  <div class="kv"><span class="k">aws:SourceVpce</span><span class="v">Policy condition: only requests arriving through this endpoint.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Private subnets go out through a NAT gateway in a public subnet; nothing comes in.</li>
  <li>Outside servers see only the NAT's address (we saw it in nginx's log).</li>
  <li>One NAT per AZ is about $43/month each before data — the classic bill surprise.</li>
  <li>Always add the free S3 gateway endpoint; choose interface endpoints for security or volume, not by reflex.</li>
  <li>Cleanup order: NAT gateway first, then release the Elastic IP.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html', '🚪', 'AWS docs — NAT gateways', 'Public vs private NAT, zonal vs regional, metrics, troubleshooting.')}
${tl('https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html', '🪣', 'AWS docs — Gateway endpoints', 'S3 and DynamoDB without NAT, endpoint policies.')}

<h3>Sources</h3>
<ul>
  <li>NAT gateways: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html</a></li>
  <li>NAT gateway scenarios: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html</a></li>
  <li>Gateway endpoints: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html</a></li>
  <li>Gateway endpoints for S3: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html</a></li>
  <li>Interface endpoints: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html</a></li>
  <li>AWS-managed prefix lists: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/working-with-aws-managed-prefix-lists.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/working-with-aws-managed-prefix-lists.html</a></li>
  <li>Prices: AWS Price List API, ap-southeast-1 (AmazonEC2: “$0.059 per NAT Gateway Hour”, “$0.059 per GB Data Processed by NAT Gateways”; AmazonVPC 17/11/2026: “$0.013 per VPC Endpoint Hour”, “$0.01 per GB … processed by VPC Endpoints”, “$0.005 per In-use public IPv4 address per hour”) — summary at <a href="https://aws.amazon.com/vpc/pricing/" target="_blank" rel="noopener">aws.amazon.com/vpc/pricing/</a></li>
</ul>
</div>
`;

const L34_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 4</span>
<h2>3.4 — NAT gateway và VPC endpoint: cho máy private đi ra, và trả tiền cho việc đó</h2>
<p class="lead">Container API của bạn nằm trong subnet private, đúng như phải thế. Nhưng chúng vẫn cần đi <em>ra</em>: tải gói npm hay Maven, kéo ảnh, gọi API thanh toán, gửi email, đọc S3. Subnet private không có đường ra Internet (bài 3.2). Bài này dựng hai lối ra — <strong>NAT gateway</strong> cho Internet và <strong>VPC endpoint</strong> cho dịch vụ AWS — cho xem NAT trên gói tin thật, và làm phép tính tiền khiến gần như nhóm nào cũng giật mình ở hoá đơn AWS đầu tiên.</p>

<h3>NAT gateway: phòng thư của khu đô thị</h3>
<ul>
  <li>NAT = Network Address Translation, dịch địa chỉ mạng. Nhiều máy private đi ra qua <strong>một địa chỉ công khai</strong>; máy chủ bên ngoài chỉ thấy địa chỉ của NAT, không bao giờ thấy địa chỉ riêng.</li>
  <li>Nó <strong>một chiều</strong>: máy private mở được kết nối ra và nhận được trả lời; bên ngoài không ai mở được kết nối vào.</li>
  <li>NAT gateway công khai nằm ở <strong>subnet public</strong>, mang một <strong>Elastic IP</strong>, và bảng định tuyến của subnet private trỏ <code>0.0.0.0/0</code> tới nó.</li>
  <li>Nó <strong>theo vùng</strong> (zonal): sống trong một AZ. AZ đó hỏng thì subnet private ở AZ khác đang đi qua nó mất Internet. Khuôn chuẩn khi chạy thật là mỗi AZ một NAT gateway, subnet private nào đi NAT của AZ đó. (Tài liệu AWS còn mô tả chế độ NAT gateway <em>regional</em> mới hơn, tự mở rộng qua các AZ.)</li>
  <li>Nó <strong>được quản lý sẵn</strong>: không phải vá, băng thông lớn. Phương án “NAT instance” (một máy EC2 nhỏ làm NAT) rẻ hơn nhưng bạn tự bảo trì.</li>
</ul>

<h3>Xem chạy thật: NAT, bảng định tuyến private và endpoint S3</h3>
${OUT_34_NAT_A}
<ul>
  <li><code>allocate-address</code> giữ một Elastic IP; <code>create-nat-gateway</code> đặt NAT vào <code>public-a</code> kèm IP đó. LocalStack tự bịa địa chỉ; trên AWS IP công khai là thật và bạn bị tính tiền.</li>
  <li>Bảng <code>rt-private</code> mới đưa <code>0.0.0.0/0</code> tới NAT, và hai subnet private dùng nó.</li>
  <li><strong>Gateway endpoint</strong> cho S3 tự thêm dòng route thứ ba: đích <code>pl-…</code> (một <em>prefix list</em> do AWS quản lý, chứa mọi dải địa chỉ S3 của region), nơi chuyển <code>vpce-…</code>. Tiền tố dài nhất thắng, nên lưu lượng S3 đi endpoint, còn lại đi NAT.</li>
</ul>

<h3>NAT trên gói tin thật: máy chủ thấy ai?</h3>
<p>Lại dùng mạng Linux thật: một mạng private <code>10.143.1.0/24</code> và một “Internet giả” <code>10.143.200.0/24</code>, cả hai cô lập, có máy chủ nginx ở <code>10.143.200.10</code>. Một container thứ ba đứng một chân mỗi mạng đóng vai NAT gateway, dùng đúng tính năng nhân Linux mà về khái niệm AWS cũng dùng: chuyển tiếp IP cộng <code>MASQUERADE</code>.</p>
${OUT_34_NAT_B}
<ul>
  <li>Trước: máy private chỉ có route local và hỏng sau 0 ms — không có đường.</li>
  <li>Hộp NAT có hai địa chỉ, mỗi mạng một cái, và <code>ip_forward = 1</code>. Một luật iptables viết lại địa chỉ nguồn của mọi gói đi về phía “Internet”.</li>
  <li>Thêm <code>default via 10.143.1.254</code> (đúng việc <code>0.0.0.0/0 → nat-…</code> làm trong bảng định tuyến) là yêu cầu thành công.</li>
  <li><strong>Log của máy chủ ghi <code>10.143.200.254</code></strong> — địa chỉ của NAT — chứ không phải <code>10.143.1.10</code>. Vì thế các API bên thứ ba bảo bạn đưa “Elastic IP của NAT gateway” vào danh sách cho phép: đó là địa chỉ duy nhất họ từng thấy.</li>
  <li>Bộ đếm MASQUERADE cho thấy đúng một kết nối đã dịch. Và máy chủ không mở được kết nối ngược vào máy private (<code>Network unreachable</code>): NAT cho lối ra, không cho lối vào.</li>
</ul>

<h3>Phép tính tiền (Singapore, bảng giá 17/11/2026)</h3>
<table>
  <thead><tr><th>Khoản</th><th>Giá</th><th>Mỗi tháng</th></tr></thead>
  <tbody>
    <tr><td>NAT gateway, theo giờ</td><td>0,059 USD</td><td>730 giờ × 0,059 = <strong>43,07 USD</strong> mỗi NAT, kể cả khi ngồi không</td></tr>
    <tr><td>Dữ liệu NAT xử lý</td><td>0,059 USD / GB</td><td>200 GB = 11,80 USD (cộng phí truyền ra Internet thông thường)</td></tr>
    <tr><td>Elastic IP (IPv4 công khai)</td><td>0,005 USD / giờ</td><td>3,65 USD</td></tr>
    <tr><td>Gateway endpoint (S3, DynamoDB)</td><td>miễn phí</td><td>0 USD — và lưu lượng S3 thôi trả phí xử lý NAT</td></tr>
    <tr><td>Interface endpoint, mỗi AZ</td><td>0,013 USD / giờ + 0,01 USD / GB</td><td>730 × 0,013 = 9,49 USD mỗi endpoint mỗi AZ</td></tr>
  </tbody>
</table>
<ul>
  <li>Hai AZ “làm cho đúng” = hai NAT gateway = <strong>khoảng 86 USD mỗi tháng trước khi chạy một byte nào</strong> — nhiều hơn cả RDS nhỏ lẫn container của một dự án sinh viên cộng lại. Đây là dòng hoá đơn làm người ta giật mình.</li>
  <li>Gateway endpoint S3 miễn phí và bỏ phí xử lý NAT cho lưu lượng S3. Nếu 150 trong 200 GB kia là ảnh tải lên S3, nó tiết kiệm 150 × 0,059 = 8,85 USD mỗi tháng mà không tốn công. Luôn thêm nó.</li>
  <li>Interface endpoint <em>không</em> tự động rẻ hơn. Một dịch vụ Fargate trong subnet private thường cần ECR (hai endpoint: <code>api</code> và <code>dkr</code>), CloudWatch Logs và Secrets Manager: 4 endpoint × 2 AZ × 9,49 USD = <strong>75,92 USD</strong> mỗi tháng — đắt hơn một NAT gateway. Chọn chúng vì bảo mật (lưu lượng không rời mạng AWS, có endpoint policy) hoặc vì lưu lượng rất lớn, đừng chọn theo phản xạ.</li>
  <li>Cho lab hay demo: không NAT gì cả. Đừng đặt thứ cần Internet vào subnet private, hoặc chỉ dùng gateway endpoint miễn phí. Lab 3.7 dựng đúng như vậy.</li>
</ul>

<h3>VPC endpoint trong một trang</h3>
<ul>
  <li><strong>Gateway endpoint</strong> — chỉ cho <strong>S3 và DynamoDB</strong>. Là một dòng trong bảng định tuyến (prefix list → <code>vpce-</code>). Miễn phí. Chỉ dùng được từ chính các subnet của VPC.</li>
  <li><strong>Interface endpoint</strong> (AWS PrivateLink) — cho đa số dịch vụ khác (ECR, SSM, Secrets Manager, CloudWatch, STS…) và dịch vụ của công ty khác bán. Nó tạo một giao diện mạng mang IP riêng trong subnet của bạn; bật private DNS thì tên máy chủ thông thường của dịch vụ phân giải ra IP riêng đó, nên mã của bạn không phải đổi.</li>
  <li><strong>Endpoint policy</strong> thêm một ổ khoá phía tài nguyên: “endpoint này chỉ được tới bucket <code>labflow-anh</code>”. Kết hợp với điều kiện <code>aws:SourceVpce</code> trong bucket policy (chương 2), một khoá bị đánh cắp dùng từ ngoài VPC của bạn là vô dụng.</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Ở nhà:</strong> mọi điện thoại trong nhà dùng chung một địa chỉ công khai của nhà mạng. Một trang web thấy được “ai đó từ nhà này” nhưng không gọi thẳng vào điện thoại của bạn được — router nhà bạn là một NAT.</li>
  <li><strong>Đi làm:</strong> phát hiện kinh điển của tháng đầu là một NAT gateway bị bỏ quên trong VPC dev nào đó, 43 USD/tháng cho không, hoặc một tác vụ đêm chép hàng terabyte từ S3 qua NAT thay vì gateway endpoint. Buổi soát chi phí bắt đầu bằng <code>describe-nat-gateways</code> ở mọi region (kịch bản “còn gì đang tính tiền” ở bài 3.7 làm việc đó).</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Máy trong subnet private tải bản cập nhật bằng cách nào?”</strong> — Route <code>0.0.0.0/0</code> tới NAT gateway ở subnet public (mỗi AZ một cái để sẵn sàng cao); chỉ chiều ra.</li>
  <li><strong>“NAT gateway khác Internet gateway thế nào?”</strong> — IGW: miễn phí, hai chiều, một-đổi-một cho tài nguyên có IP công khai. NAT: tính tiền theo giờ và theo GB, nhiều-đổi-một, chỉ chiều ra, cho tài nguyên private.</li>
  <li><strong>“Cắt hoá đơn NAT cho lưu lượng S3 thế nào?”</strong> — Thêm gateway endpoint S3 (miễn phí) vào các bảng định tuyến private; lưu lượng S3 đi route của endpoint.</li>
  <li><strong>“Gateway endpoint khác interface endpoint thế nào?”</strong> — Gateway: chỉ S3/DynamoDB, là dòng trong bảng định tuyến, miễn phí. Interface: giao diện mạng có IP riêng qua PrivateLink, nhiều dịch vụ, tính theo giờ + theo GB.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên LocalStack: xin một Elastic IP, tạo NAT gateway ở <code>public-a</code>, tạo <code>rt-private</code> với <code>0.0.0.0/0 → nat</code>, gắn hai subnet private.</li>
  <li>Thêm gateway endpoint S3 vào <code>rt-private</code> rồi liệt kê route. Lưu lượng tới S3 đi route nào, vì sao?</li>
  <li>Tính tiền tháng cho thiết kế có hai NAT gateway và 300 GB đi qua, rồi tính lại khi endpoint S3 gánh 250 GB trong số đó.</li>
  <li>Dọn: xoá NAT gateway và <strong>trả lại</strong> Elastic IP (EIP không gắn vẫn tốn tiền).</li>
</ol>
<p><strong>Đạt khi:</strong> <code>rt-private</code> có ba route (local, <code>0.0.0.0/0 → nat-</code>, <code>pl- → vpce-</code>), đáp án tiền là 2 × 43,07 + 300 × 0,059 = 103,84 USD trước và 89,09 USD sau khi có endpoint (chưa tính EIP), và <code>describe-addresses</code> trả về rỗng.</p>
${giai('Gợi ý: các lệnh', bash(`
E=$(aws ec2 allocate-address --domain vpc --query AllocationId --output text)
N=$(aws ec2 create-nat-gateway --subnet-id $PUBLIC_A --allocation-id $E --query NatGateway.NatGatewayId --output text)
aws ec2 create-route --route-table-id $RT_PRIVATE --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $N
aws ec2 create-vpc-endpoint --vpc-id $V --vpc-endpoint-type Gateway \\
  --service-name com.amazonaws.ap-southeast-1.s3 --route-table-ids $RT_PRIVATE
# dọn: NAT trước, rồi mới trả EIP
aws ec2 delete-nat-gateway --nat-gateway-id $N
aws ec2 release-address --allocation-id $E`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">NAT gateway</span><span class="v">Dịch nhiều-đổi-một chiều ra, được quản lý sẵn; theo vùng; 0,059 USD/giờ + 0,059 USD/GB (Singapore).</span></div>
  <div class="kv"><span class="k">MASQUERADE</span><span class="v">Luật NAT của Linux viết lại địa chỉ nguồn thành địa chỉ của cổng đi ra.</span></div>
  <div class="kv"><span class="k">Elastic IP</span><span class="v">IPv4 công khai cố định; tính tiền theo giờ dù có gắn hay không.</span></div>
  <div class="kv"><span class="k">Gateway endpoint</span><span class="v">Route miễn phí tới S3/DynamoDB qua một prefix list do AWS quản lý.</span></div>
  <div class="kv"><span class="k">Interface endpoint</span><span class="v">Giao diện mạng PrivateLink mang IP riêng cho một dịch vụ AWS; 0,013 USD/giờ mỗi AZ.</span></div>
  <div class="kv"><span class="k">Prefix list</span><span class="v">Tập CIDR có tên (pl-…) dùng được trong route và security group.</span></div>
  <div class="kv"><span class="k">aws:SourceVpce</span><span class="v">Điều kiện trong policy: chỉ yêu cầu đi qua endpoint này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Subnet private đi ra qua NAT gateway ở subnet public; không gì đi vào được.</li>
  <li>Máy chủ bên ngoài chỉ thấy địa chỉ của NAT (ta đã thấy trong log nginx).</li>
  <li>Mỗi AZ một NAT là khoảng 43 USD/tháng mỗi cái chưa tính dữ liệu — cú giật mình kinh điển của hoá đơn.</li>
  <li>Luôn thêm gateway endpoint S3 miễn phí; chọn interface endpoint vì bảo mật hay lưu lượng, không theo phản xạ.</li>
  <li>Thứ tự dọn: NAT gateway trước, rồi mới trả Elastic IP.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html', '🚪', 'Tài liệu AWS — NAT gateway', 'NAT public và private, zonal và regional, số đo, gỡ lỗi.')}
${tl('https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html', '🪣', 'Tài liệu AWS — Gateway endpoint', 'S3 và DynamoDB không cần NAT, endpoint policy.')}

<h3>Nguồn</h3>
<ul>
  <li>NAT gateway: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html</a></li>
  <li>Các kịch bản NAT gateway: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html</a></li>
  <li>Gateway endpoint: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html</a></li>
  <li>Gateway endpoint cho S3: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html</a></li>
  <li>Interface endpoint: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html</a></li>
  <li>Prefix list do AWS quản lý: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/working-with-aws-managed-prefix-lists.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/working-with-aws-managed-prefix-lists.html</a></li>
  <li>Giá: AWS Price List API, ap-southeast-1 (AmazonEC2: “$0.059 per NAT Gateway Hour”, “$0.059 per GB Data Processed by NAT Gateways”; AmazonVPC 17/11/2026: “$0.013 per VPC Endpoint Hour”, “$0.01 per GB … processed by VPC Endpoints”, “$0.005 per In-use public IPv4 address per hour”) — tóm tắt ở <a href="https://aws.amazon.com/vpc/pricing/" target="_blank" rel="noopener">aws.amazon.com/vpc/pricing/</a></li>
</ul>
</div>
`;

/* ═════ 3.5 — Nối các mạng: peering, Transit Gateway, VPN ═════ */
const L35_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 5</span>
<h2>3.5 — Connecting networks: peering, Transit Gateway, VPN and Direct Connect</h2>
<p class="lead">One VPC is rarely alone for long. The data team has its own VPC, staging and production live apart, a partner company needs private access, the office wants to reach an internal admin tool. AWS offers four main ways to join networks, and the exam loves to ask which one fits. This lesson builds peering and a Transit Gateway for real on LocalStack, and spends most of its time on the two rules that decide everything: <strong>no overlapping ranges</strong> and <strong>peering is not transitive</strong>.</p>

<h3>VPC peering: a private bridge between two estates</h3>
<ul>
  <li>A one-to-one connection between two VPCs — same or different account, same or different region. Traffic stays on AWS's network and uses private IPs.</li>
  <li>One side requests, the other side <strong>accepts</strong>; then <strong>both</strong> sides add routes (<code>destination = other VPC's CIDR → pcx-…</code>) and open security groups. Forget one side's route and packets go out but replies never come back.</li>
  <li><strong>The CIDRs must not overlap.</strong> This is where the planning of lesson 3.1 pays off.</li>
  <li><strong>Not transitive.</strong> If A is peered with B and B with C, A cannot reach C through B. Every pair that must talk needs its own peering.</li>
  <li>Cost: no hourly fee. Since 1 May 2021, data over a peering connection that stays inside one Availability Zone is free; data crossing AZs is charged at normal in-region rates.</li>
</ul>

<h3>See it running: A–B–C and the transitive trap</h3>
${OUT_35_KETNOI}
<ul>
  <li>Three VPCs: A <code>10.0.0.0/16</code> (our <code>labflow-vpc</code>), B <code>10.1.0.0/16</code>, C <code>10.2.0.0/16</code>. Peerings A–B and B–C are <code>active</code>.</li>
  <li>We added to A's table a route to C (<code>10.2.0.0/16</code>) via the A–B peering. LocalStack accepted it — but that does not make it work: B will not forward A's packets to C, because <strong>peering is not transitive</strong>. Whatever an API accepts, the data plane drops them. To let A talk to C you create an A–C peering, or move to a Transit Gateway.</li>
  <li><strong>Emulator difference:</strong> LocalStack also accepted a peering request between two VPCs that both use <code>10.0.0.0/16</code>. Real AWS rejects overlapping CIDRs — the connection ends in a <code>failed</code> state. Again: read the limits in the documentation, not in the emulator.</li>
  <li>The Transit Gateway part: one hub <code>tgw-…</code> with three VPC attachments, all <code>available</code>. Each VPC then routes the others' ranges to the TGW.</li>
</ul>

<h3>Transit Gateway: a central bus station</h3>
<p>Peering every pair grows fast: n VPCs need n(n−1)/2 peerings — 10 VPCs need 45, each with routes on both sides. A <strong>Transit Gateway</strong> is a regional router you attach VPCs (and VPNs, Direct Connect) to: a hub-and-spoke instead of a mesh. Its route tables can also <em>separate</em> traffic — production cannot reach development even though both are attached.</p>
<table>
  <thead><tr><th>Singapore (price list 17/11/2026)</th><th>Price</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>TGW VPC attachment</td><td>$0.07 / hour</td><td>3 VPCs × 730 h × 0.07 = <strong>$153.30 / month</strong></td></tr>
    <tr><td>TGW data processed</td><td>$0.02 / GB</td><td>500 GB = $10</td></tr>
    <tr><td>VPC peering</td><td>no hourly fee</td><td>free within an AZ, in-region rate across AZs</td></tr>
  </tbody>
</table>
<p>For three VPCs, peering is far cheaper; a Transit Gateway pays off when the number of networks, on-premises links or the need for central routing control grows.</p>

<h3>Reaching an office or a data centre</h3>
<ul>
  <li><strong>Site-to-Site VPN</strong> — an encrypted IPsec connection over the Internet between your VPC (a virtual private gateway or the Transit Gateway) and the office's router. Each connection has <strong>two tunnels</strong> in different AZs for redundancy. $0.05 per connection-hour in Singapore (≈ $36.50/month). Set up in hours; bandwidth and latency follow the Internet.</li>
  <li><strong>Client VPN</strong> — for individual laptops (OpenVPN-based): $0.15 per hour per subnet association plus $0.05 per active connection-hour.</li>
  <li><strong>Direct Connect</strong> — a dedicated physical line from your data centre (or a partner's location) into AWS. Stable latency, high bandwidth, lower data-transfer price; takes weeks to set up. It is <em>not</em> encrypted by default — teams often run a VPN over it.</li>
</ul>

<h3>Choosing — the exam table</h3>
<table>
  <thead><tr><th>Situation</th><th>Choose</th></tr></thead>
  <tbody>
    <tr><td>Two or three VPCs must talk privately, low cost</td><td>VPC peering</td></tr>
    <tr><td>Many VPCs and accounts, central routing, also on-premises</td><td>Transit Gateway</td></tr>
    <tr><td>Office needs access today, over the Internet, encrypted</td><td>Site-to-Site VPN</td></tr>
    <tr><td>Consistent latency, large volumes, regulated workloads</td><td>Direct Connect (+ VPN for encryption or backup)</td></tr>
    <tr><td>Expose one service to other VPCs without joining networks</td><td>PrivateLink (interface endpoint service, lesson 3.4)</td></tr>
  </tbody>
</table>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Real life:</strong> peering is a private bridge between two islands — island A cannot use island B's bridge to reach island C. A Transit Gateway is the ferry terminal every island connects to.</li>
  <li><strong>At work:</strong> when a company acquires another one, “connect their AWS to ours” is a classic first project. The first meeting is not about technology — it is about whose <code>10.0.0.0/16</code> has to move.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“A is peered with B, B with C. Can A reach C?”</strong> — No, peering is not transitive. Peer A–C directly or use a Transit Gateway.</li>
  <li><strong>“Two VPCs both use 10.0.0.0/16. Can you peer them?”</strong> — No, overlapping CIDRs cannot be peered. Re-address one VPC, or expose specific services with PrivateLink.</li>
  <li><strong>“VPN vs Direct Connect?”</strong> — VPN: encrypted over the Internet, quick, cheap, variable latency. Direct Connect: private physical line, consistent latency and high bandwidth, weeks to provision, not encrypted by default.</li>
  <li><strong>“When is a Transit Gateway worth its hourly cost?”</strong> — Many VPCs/accounts, on-premises links, or when you need central route-table control and segmentation.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
  <li>On LocalStack create VPCs <code>10.1.0.0/16</code> and <code>10.2.0.0/16</code> next to your <code>labflow-vpc</code>. Peer labflow–B and B–C, accept both, add routes on <em>both</em> sides of labflow–B.</li>
  <li>Draw (on paper) what happens to a packet from labflow to <code>10.2.0.5</code>, and fix the design.</li>
  <li>Compute: how many peerings for 6 VPCs in a full mesh? What does a TGW with 6 attachments cost per month in Singapore?</li>
  <li>Delete the peerings and the extra VPCs.</li>
</ol>
<p><strong>Done when:</strong> both peerings are <code>active</code> with routes on both sides, you can explain why labflow still cannot reach C, and your answers are 15 peerings and 6 × 730 × 0.07 = $306.60 per month (before data).</p>
${giai('Hint: commands', bash(`
P=$(aws ec2 create-vpc-peering-connection --vpc-id $A --peer-vpc-id $B --query VpcPeeringConnection.VpcPeeringConnectionId --output text)
aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id $P
aws ec2 create-route --route-table-id $RT_A --destination-cidr-block 10.1.0.0/16 --vpc-peering-connection-id $P
aws ec2 create-route --route-table-id $RT_B --destination-cidr-block 10.20.0.0/16 --vpc-peering-connection-id $P   # chiều về!
python3 -c "n=6; print(n*(n-1)//2, round(n*730*0.07, 2))"
aws ec2 delete-vpc-peering-connection --vpc-peering-connection-id $P`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">VPC peering</span><span class="v">Private 1:1 link between two VPCs; no overlap; not transitive; routes on both sides.</span></div>
  <div class="kv"><span class="k">Transitive</span><span class="v">Reaching C through B. Peering never allows it.</span></div>
  <div class="kv"><span class="k">Transit Gateway</span><span class="v">Regional hub router for VPCs, VPNs, Direct Connect; $0.07/attachment-hour (Singapore).</span></div>
  <div class="kv"><span class="k">Site-to-Site VPN</span><span class="v">IPsec over the Internet, two tunnels per connection; $0.05/hour (Singapore).</span></div>
  <div class="kv"><span class="k">Client VPN</span><span class="v">Managed VPN for individual users' devices.</span></div>
  <div class="kv"><span class="k">Direct Connect</span><span class="v">Dedicated physical line into AWS; consistent latency; not encrypted by default.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Peering: cheap, 1:1, needs non-overlapping CIDRs and routes on both sides; never transitive.</li>
  <li>Transit Gateway: hub-and-spoke for many networks; pay per attachment-hour and per GB.</li>
  <li>VPN for quick encrypted links over the Internet; Direct Connect for a dedicated line.</li>
  <li>An emulator accepting something (overlap, transitive route) proves nothing about AWS.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html', '🌉', 'AWS docs — VPC peering basics and limitations', 'Overlapping CIDRs, transitive peering, edge-to-edge routing.')}
${tl('https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html', '🚌', 'AWS docs — What is a transit gateway?', 'Attachments, route tables, segmentation.')}

<h3>Sources</h3>
<ul>
  <li>What is VPC peering: <a href="https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html</a></li>
  <li>Peering limitations (overlap, not transitive): <a href="https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html</a></li>
  <li>Peering data free within an AZ from 01/05/2021: <a href="https://aws.amazon.com/about-aws/whats-new/2021/05/amazon-vpc-announces-pricing-change-for-vpc-peering/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2021/05/amazon-vpc-announces-pricing-change-for-vpc-peering/</a></li>
  <li>Transit Gateway: <a href="https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html</a></li>
  <li>Site-to-Site VPN: <a href="https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html</a></li>
  <li>Direct Connect: <a href="https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html</a></li>
  <li>Prices: AWS Price List API, AmazonVPC ap-southeast-1, 17/11/2026 (“$0.07 per Transit Gateway VPC Attachment Hour”, “$0.02 per GB Data Processed by Transit Gateway VPC Attachment”, “$0.05 per VPN Connection-Hour”, “$0.15 per Client VPN Endpoint Association Hour”, “$0.05 per Client VPN Connection Hour”).</li>
</ul>
</div>
`;

const L35_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 5</span>
<h2>3.5 — Nối các mạng: peering, Transit Gateway, VPN và Direct Connect</h2>
<p class="lead">Một VPC hiếm khi đứng một mình lâu. Nhóm dữ liệu có VPC riêng, staging và production ở tách nhau, một công ty đối tác cần truy cập riêng, văn phòng muốn vào một công cụ quản trị nội bộ. AWS có bốn cách chính để nối mạng, và đề thi rất thích hỏi cách nào hợp. Bài này dựng thật peering và Transit Gateway trên LocalStack, và dành phần lớn thời gian cho hai luật quyết định mọi thứ: <strong>không trùng dải</strong> và <strong>peering không bắc cầu</strong>.</p>

<h3>VPC peering: cây cầu riêng giữa hai khu đô thị</h3>
<ul>
  <li>Kết nối một-một giữa hai VPC — cùng hay khác tài khoản, cùng hay khác region. Lưu lượng đi trong mạng của AWS và dùng IP riêng.</li>
  <li>Một bên gửi yêu cầu, bên kia <strong>chấp nhận</strong>; rồi <strong>cả hai</strong> bên thêm route (<code>đích = CIDR của VPC bên kia → pcx-…</code>) và mở security group. Quên route của một bên là gói tin đi được mà câu trả lời không bao giờ về.</li>
  <li><strong>CIDR không được chồng nhau.</strong> Đây là chỗ quy hoạch ở bài 3.1 trả công.</li>
  <li><strong>Không bắc cầu.</strong> A peering với B, B peering với C, thì A không tới được C qua B. Cặp nào cần nói chuyện thì cần peering riêng.</li>
  <li>Chi phí: không tính theo giờ. Từ 01/05/2021, dữ liệu qua peering mà ở trong một Availability Zone là miễn phí; dữ liệu đi qua AZ khác tính theo giá truyền trong region thông thường.</li>
</ul>

<h3>Xem chạy thật: A–B–C và cái bẫy bắc cầu</h3>
${OUT_35_KETNOI}
<ul>
  <li>Ba VPC: A <code>10.0.0.0/16</code> (chính <code>labflow-vpc</code>), B <code>10.1.0.0/16</code>, C <code>10.2.0.0/16</code>. Peering A–B và B–C đều <code>active</code>.</li>
  <li>Ta thêm vào bảng của A một route tới C (<code>10.2.0.0/16</code>) qua peering A–B. LocalStack nhận — nhưng nhận không có nghĩa là chạy: B sẽ không chuyển tiếp gói của A sang C, vì <strong>peering không bắc cầu</strong>. API nhận gì thì nhận, tầng dữ liệu vẫn vứt gói. Muốn A nói với C thì tạo peering A–C, hoặc chuyển sang Transit Gateway.</li>
  <li><strong>Khác biệt của trình giả lập:</strong> LocalStack còn nhận cả yêu cầu peering giữa hai VPC cùng dùng <code>10.0.0.0/16</code>. AWS thật từ chối CIDR chồng nhau — kết nối kết thúc ở trạng thái <code>failed</code>. Lại một lần nữa: đọc giới hạn trong tài liệu, đừng đọc trong trình giả lập.</li>
  <li>Phần Transit Gateway: một trung tâm <code>tgw-…</code> với ba VPC gắn vào, đều <code>available</code>. Sau đó mỗi VPC đưa dải của các VPC khác tới TGW.</li>
</ul>

<h3>Transit Gateway: bến xe trung tâm</h3>
<p>Peering từng cặp tăng rất nhanh: n VPC cần n(n−1)/2 peering — 10 VPC cần 45 cái, cái nào cũng có route hai bên. <strong>Transit Gateway</strong> là một router cấp region để bạn gắn VPC (cả VPN, Direct Connect) vào: mô hình trục-nan hoa thay cho mạng lưới chằng chịt. Bảng định tuyến của nó còn <em>tách</em> được lưu lượng — production không tới được development dù cả hai đều gắn vào.</p>
<table>
  <thead><tr><th>Singapore (bảng giá 17/11/2026)</th><th>Giá</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>TGW gắn VPC</td><td>0,07 USD / giờ</td><td>3 VPC × 730 giờ × 0,07 = <strong>153,30 USD / tháng</strong></td></tr>
    <tr><td>TGW xử lý dữ liệu</td><td>0,02 USD / GB</td><td>500 GB = 10 USD</td></tr>
    <tr><td>VPC peering</td><td>không tính theo giờ</td><td>miễn phí trong một AZ, giá trong region khi qua AZ</td></tr>
  </tbody>
</table>
<p>Với ba VPC, peering rẻ hơn hẳn; Transit Gateway đáng tiền khi số mạng, số đường nối về hạ tầng tại chỗ hay nhu cầu kiểm soát định tuyến tập trung tăng lên.</p>

<h3>Nối về văn phòng hay trung tâm dữ liệu</h3>
<ul>
  <li><strong>Site-to-Site VPN</strong> — kết nối IPsec mã hoá qua Internet giữa VPC (virtual private gateway hoặc Transit Gateway) và router của văn phòng. Mỗi kết nối có <strong>hai đường hầm</strong> ở hai AZ để dự phòng. 0,05 USD mỗi giờ kết nối ở Singapore (≈ 36,50 USD/tháng). Dựng trong vài giờ; băng thông và độ trễ theo Internet.</li>
  <li><strong>Client VPN</strong> — cho từng laptop (dựa trên OpenVPN): 0,15 USD mỗi giờ cho mỗi subnet gắn vào, cộng 0,05 USD mỗi giờ cho mỗi kết nối đang hoạt động.</li>
  <li><strong>Direct Connect</strong> — đường truyền vật lý riêng từ trung tâm dữ liệu của bạn (hoặc địa điểm của đối tác) vào AWS. Độ trễ ổn định, băng thông lớn, giá truyền dữ liệu thấp hơn; mất vài tuần để dựng. Mặc định nó <em>không</em> mã hoá — nhiều nhóm chạy thêm VPN bên trên.</li>
</ul>

<h3>Chọn cái nào — bảng của đề thi</h3>
<table>
  <thead><tr><th>Tình huống</th><th>Chọn</th></tr></thead>
  <tbody>
    <tr><td>Hai, ba VPC cần nói chuyện riêng, rẻ</td><td>VPC peering</td></tr>
    <tr><td>Nhiều VPC và tài khoản, định tuyến tập trung, cả hạ tầng tại chỗ</td><td>Transit Gateway</td></tr>
    <tr><td>Văn phòng cần vào ngay hôm nay, qua Internet, có mã hoá</td><td>Site-to-Site VPN</td></tr>
    <tr><td>Độ trễ ổn định, khối lượng lớn, khối lượng việc bị quản lý chặt</td><td>Direct Connect (+ VPN để mã hoá hoặc dự phòng)</td></tr>
    <tr><td>Mở một dịch vụ cho VPC khác mà không nối hai mạng</td><td>PrivateLink (endpoint service, bài 3.4)</td></tr>
  </tbody>
</table>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Đời thường:</strong> peering là cây cầu riêng giữa hai hòn đảo — đảo A không mượn cầu của đảo B để sang đảo C được. Transit Gateway là bến phà mà đảo nào cũng nối vào.</li>
  <li><strong>Đi làm:</strong> khi một công ty mua lại công ty khác, “nối AWS của họ với của mình” là dự án đầu tiên kinh điển. Buổi họp đầu không bàn công nghệ — mà bàn <code>10.0.0.0/16</code> của bên nào phải dời đi.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“A peering với B, B peering với C. A tới được C không?”</strong> — Không, peering không bắc cầu. Peering A–C trực tiếp hoặc dùng Transit Gateway.</li>
  <li><strong>“Hai VPC cùng dùng 10.0.0.0/16. Peering được không?”</strong> — Không, CIDR chồng nhau không peering được. Đánh lại địa chỉ một VPC, hoặc mở từng dịch vụ qua PrivateLink.</li>
  <li><strong>“VPN khác Direct Connect thế nào?”</strong> — VPN: mã hoá qua Internet, nhanh, rẻ, độ trễ thay đổi. Direct Connect: đường vật lý riêng, độ trễ ổn định và băng thông lớn, mất vài tuần, mặc định không mã hoá.</li>
  <li><strong>“Khi nào Transit Gateway đáng phí theo giờ?”</strong> — Nhiều VPC/tài khoản, có đường về hạ tầng tại chỗ, hoặc cần kiểm soát bảng định tuyến tập trung và chia vùng.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
  <li>Trên LocalStack tạo VPC <code>10.1.0.0/16</code> và <code>10.2.0.0/16</code> cạnh <code>labflow-vpc</code>. Peering labflow–B và B–C, chấp nhận cả hai, thêm route ở <em>cả hai</em> bên của labflow–B.</li>
  <li>Vẽ (trên giấy) chuyện gì xảy ra với một gói từ labflow tới <code>10.2.0.5</code>, rồi sửa thiết kế.</li>
  <li>Tính: mạng lưới đầy đủ 6 VPC cần bao nhiêu peering? TGW với 6 VPC gắn vào tốn bao nhiêu mỗi tháng ở Singapore?</li>
  <li>Xoá các peering và các VPC thêm.</li>
</ol>
<p><strong>Đạt khi:</strong> hai peering đều <code>active</code> và có route ở cả hai bên, bạn giải thích được vì sao labflow vẫn không tới được C, và đáp án là 15 peering và 6 × 730 × 0,07 = 306,60 USD mỗi tháng (chưa tính dữ liệu).</p>
${giai('Gợi ý: các lệnh', bash(`
P=$(aws ec2 create-vpc-peering-connection --vpc-id $A --peer-vpc-id $B --query VpcPeeringConnection.VpcPeeringConnectionId --output text)
aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id $P
aws ec2 create-route --route-table-id $RT_A --destination-cidr-block 10.1.0.0/16 --vpc-peering-connection-id $P
aws ec2 create-route --route-table-id $RT_B --destination-cidr-block 10.20.0.0/16 --vpc-peering-connection-id $P   # chiều về!
python3 -c "n=6; print(n*(n-1)//2, round(n*730*0.07, 2))"
aws ec2 delete-vpc-peering-connection --vpc-peering-connection-id $P`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">VPC peering</span><span class="v">Đường riêng một-một giữa hai VPC; không trùng dải; không bắc cầu; route ở cả hai bên.</span></div>
  <div class="kv"><span class="k">Bắc cầu</span><span class="v">Tới C bằng cách đi qua B. Peering không bao giờ cho phép.</span></div>
  <div class="kv"><span class="k">Transit Gateway</span><span class="v">Router trung tâm cấp region cho VPC, VPN, Direct Connect; 0,07 USD/giờ mỗi kết nối gắn (Singapore).</span></div>
  <div class="kv"><span class="k">Site-to-Site VPN</span><span class="v">IPsec qua Internet, mỗi kết nối hai đường hầm; 0,05 USD/giờ (Singapore).</span></div>
  <div class="kv"><span class="k">Client VPN</span><span class="v">VPN được quản lý sẵn cho thiết bị của từng người dùng.</span></div>
  <div class="kv"><span class="k">Direct Connect</span><span class="v">Đường vật lý riêng vào AWS; độ trễ ổn định; mặc định không mã hoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Peering: rẻ, một-một, cần CIDR không chồng và route hai bên; không bao giờ bắc cầu.</li>
  <li>Transit Gateway: trục-nan hoa cho nhiều mạng; trả theo giờ mỗi kết nối gắn và theo GB.</li>
  <li>VPN cho đường mã hoá nhanh qua Internet; Direct Connect cho đường truyền riêng.</li>
  <li>Trình giả lập nhận một thứ (dải trùng, route bắc cầu) không chứng minh gì về AWS.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html', '🌉', 'Tài liệu AWS — Cơ bản và giới hạn của VPC peering', 'CIDR chồng nhau, peering bắc cầu, định tuyến qua biên.')}
${tl('https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html', '🚌', 'Tài liệu AWS — Transit gateway là gì?', 'Kết nối gắn, bảng định tuyến, chia vùng.')}

<h3>Nguồn</h3>
<ul>
  <li>VPC peering là gì: <a href="https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html</a></li>
  <li>Giới hạn peering (trùng dải, không bắc cầu): <a href="https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html</a></li>
  <li>Dữ liệu peering trong một AZ miễn phí từ 01/05/2021: <a href="https://aws.amazon.com/about-aws/whats-new/2021/05/amazon-vpc-announces-pricing-change-for-vpc-peering/" target="_blank" rel="noopener">aws.amazon.com/about-aws/whats-new/2021/05/amazon-vpc-announces-pricing-change-for-vpc-peering/</a></li>
  <li>Transit Gateway: <a href="https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html</a></li>
  <li>Site-to-Site VPN: <a href="https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html</a></li>
  <li>Direct Connect: <a href="https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html" target="_blank" rel="noopener">docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html</a></li>
  <li>Giá: AWS Price List API, AmazonVPC ap-southeast-1, 17/11/2026 (“$0.07 per Transit Gateway VPC Attachment Hour”, “$0.02 per GB Data Processed by Transit Gateway VPC Attachment”, “$0.05 per VPN Connection-Hour”, “$0.15 per Client VPN Endpoint Association Hour”, “$0.05 per Client VPN Connection Hour”).</li>
</ul>
</div>
`;

/* ═════ 3.6 — Vào máy private: bastion, SSM, flow log ═════ */
const L36_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 6</span>
<h2>3.6 — Reaching private machines: bastion, Session Manager and flow logs</h2>
<p class="lead">You put the database and the API in private subnets. Good — now how does a human get in at 2 a.m. to read a log or run a query? The old answer is a <strong>bastion host</strong> with port 22 open. The modern answer is <strong>no open port at all</strong>: AWS Systems Manager Session Manager. And when something strange happens, <strong>VPC Flow Logs</strong> tell you who knocked on which door. This lesson starts from the attacker's side, with a real port scan, because that is the best argument for closing ports.</p>

<h3>🔓 Hacker's view first: what a scanner sees</h3>
<p>We ran a real scanner, <strong>nmap</strong>, from a container playing the attacker against a machine <code>10.143.60.10</code> that exposes SSH (port 22, Dropbear) and a real PostgreSQL 16 (port 5432) to the whole network — the equivalent of a security group with <code>0.0.0.0/0</code> on both ports. Then we tightened it the way a security group would, and scanned again from three places:</p>
${OUT_36_VAOMAY_A}
<ul>
  <li>The first scan took 6 seconds and told the attacker not only “22 and 5432 are open” but the <strong>exact SSH software and version</strong> and that it is PostgreSQL. That is the shopping list for picking an exploit.</li>
  <li>After the rules, the attacker sees both ports as <code>filtered</code>: packets vanish, nothing answers. The bastion (<code>10.143.60.20</code>) sees only 22 open; the app (<code>10.143.60.30</code>) sees only 5432 open. Each tier sees exactly what it needs — that is the security-group chain of lesson 3.3 working on real packets.</li>
  <li>The counter <code>policy DROP 8 packets</code> is the attacker's probes, silently discarded.</li>
</ul>
<p>How fast does this happen on the real Internet? The open-source scanner <strong>masscan</strong> describes itself as able to scan the entire IPv4 Internet in under 5 minutes. Unit 42's 2021 honeypots (lesson 3.3) were compromised within 24 hours in 80% of cases. And in July 2024 Qualys disclosed <strong>regreSSHion (CVE-2024-6387)</strong>, an unauthenticated remote code execution as root in OpenSSH's server, reporting <strong>over 14 million potentially vulnerable OpenSSH instances exposed to the Internet</strong>. An SSH port that the Internet cannot reach is not affected by the next such bug on day one.</p>

<h3>Option 1: the bastion host (jump box)</h3>
<ul>
  <li>A small EC2 in a public subnet with port 22 open <strong>only to your office IP</strong>. You SSH to it, then from it to the private machines: <code>ssh -J ec2-user@bastion ec2-user@10.0.11.25</code>.</li>
  <li>Private machines accept 22 only from the bastion's security group.</li>
  <li>Costs: an always-on machine and a public IPv4; SSH keys to distribute, rotate and revoke when people leave; the bastion itself must be patched (it is exposed); logs of what people typed are your problem.</li>
</ul>

<h3>Option 2: Session Manager — no inbound port at all</h3>
<ul>
  <li>The <strong>SSM Agent</strong> on the instance (pre-installed on Amazon Linux and recent Ubuntu AMIs) opens an <strong>outbound</strong> HTTPS connection to the Systems Manager service. You open a shell through that connection: <code>aws ssm start-session --target i-0123…</code>.</li>
  <li>Inbound rules: <strong>none</strong>. No port 22, no bastion, no SSH keys. Access is an <strong>IAM permission</strong> (<code>ssm:StartSession</code>), so it follows chapter 1: MFA, roles, least privilege, removed with the user.</li>
  <li>Every session is recorded in <strong>CloudTrail</strong>, and the session output can be logged to S3 or CloudWatch Logs — the auditor's favourite feature.</li>
  <li>The instance needs an instance profile role with the <code>AmazonSSMManagedInstanceCore</code> policy and a way to reach SSM: a NAT gateway, or three interface endpoints (<code>ssm</code>, <code>ssmmessages</code>, <code>ec2messages</code>) for fully private subnets (cost: lesson 3.4).</li>
  <li><strong>Port forwarding</strong> reaches a private database from your laptop without opening anything: the document <code>AWS-StartPortForwardingSessionToRemoteHost</code> forwards <code>localhost:5432</code> through an instance to an RDS endpoint.</li>
  <li>An alternative for SSH-based tools: <strong>EC2 Instance Connect Endpoint</strong> (2023) lets you SSH to private instances through an endpoint in the VPC, also without a bastion or public IP.</li>
</ul>
${bash(`
# Mở shell vào máy private — không cổng 22, không khoá SSH (AWS thật; minh hoạ, không chạy được trên LocalStack)
aws ssm start-session --target i-0123456789abcdef0

# Nối localhost:5432 trên laptop tới RDS private qua máy đó
aws ssm start-session --target i-0123456789abcdef0 \\
  --document-name AWS-StartPortForwardingSessionToRemoteHost \\
  --parameters '{"host":["labflow-db.xxxx.ap-southeast-1.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["5432"]}'`)}
<p>These commands need a real AWS account and instance — LocalStack's community edition does not emulate Session Manager — so they are shown, not run. Chapter 4 runs them on a real free-tier instance.</p>

<h3>VPC Flow Logs: who knocked on which door</h3>
<ul>
  <li>Flow logs record <strong>metadata</strong> of IP traffic — source, destination, ports, protocol, bytes, ACCEPT/REJECT — for a VPC, a subnet or one network interface. They do <strong>not</strong> capture packet contents.</li>
  <li>Destinations: CloudWatch Logs, S3 or Data Firehose. Traffic type: <code>ACCEPT</code>, <code>REJECT</code> or <code>ALL</code>. Logging only <code>REJECT</code> is a cheap start: it shows scanners and misconfigured rules.</li>
  <li>Not real time: records are aggregated over an interval (default 10 minutes, or 1 minute) before delivery.</li>
  <li>Some traffic is never logged, for example queries to the Amazon DNS server and requests to the instance metadata service <code>169.254.169.254</code>.</li>
</ul>
${OUT_36_VAOMAY_B}
<ul>
  <li>LocalStack stored the flow-log configuration but, being an emulator, generates no records. So we parsed the <strong>example records from the AWS documentation</strong> with one line of <code>awk</code> (field 13 is the action).</li>
  <li>Fields in the default format: version, account, interface, <strong>source address, destination address, source port, destination port, protocol</strong> (6 = TCP, 1 = ICMP), packets, bytes, start, end, <strong>action</strong>, log status.</li>
  <li>Record 2: someone at <code>172.31.9.69</code> tried RDP (3389) and was rejected — what a scan looks like.</li>
  <li>Records 3–4 are the documentation's lesson on statelessness: an inbound ping (ICMP) was <strong>ACCEPT</strong>ed, but the reply going back out was <strong>REJECT</strong>ed. A security group would have let the reply out automatically; this is a NACL without an outbound rule — exactly the failure we reproduced in 3.3.</li>
</ul>

<h3>Real-life and real-job links</h3>
<ul>
  <li><strong>Real life:</strong> a bastion is a reception desk at the building entrance — someone must sit there, check badges and keep the key cabinet. Session Manager is a badge reader tied to the company's HR system: leave the company and your badge stops working everywhere at once, and every door you opened is logged.</li>
  <li><strong>At work:</strong> security reviews increasingly fail any design that has port 22 open to the Internet. “We use Session Manager, there is no inbound SSH” is the answer they want. When an incident happens, the first question is “show me the flow logs for that interface”.</li>
</ul>

<h3>🎤 What interviewers ask</h3>
<ol>
  <li><strong>“How do you give engineers shell access to private instances?”</strong> — Session Manager: no inbound ports, IAM-controlled, logged in CloudTrail; instance role with AmazonSSMManagedInstanceCore; NAT or SSM interface endpoints.</li>
  <li><strong>“What is a bastion host and what are its downsides?”</strong> — A hardened jump box in a public subnet; downsides: exposed port, key management, patching, audit.</li>
  <li><strong>“What do VPC Flow Logs contain, and what not?”</strong> — Connection metadata (IPs, ports, protocol, bytes, accept/reject), not payloads; not real time; some traffic (Amazon DNS, metadata service) is excluded.</li>
  <li><strong>“A connection works inbound but replies are dropped. How do flow logs show it?”</strong> — An ACCEPT record inbound and a REJECT record for the reply: a stateless NACL missing an outbound rule.</li>
</ol>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
  <li>Build the scan lab: an internal Docker network, a target container with Dropbear on 22 and a PostgreSQL container sharing its network (<code>--network container:…</code>), plus “hacker”, “bastion” and “app” containers with fixed IPs.</li>
  <li>Scan from the hacker with <code>nmap -Pn -sV</code>. Write down what you learned about the target.</li>
  <li>Add iptables rules on the target so that 22 is reachable only from the bastion and 5432 only from the app. Scan again from all three.</li>
  <li>Write an <code>awk</code> one-liner that prints only REJECTed TCP (protocol 6) records from <code>flow-mau.txt</code>.</li>
</ol>
<p><strong>Done when:</strong> the hacker sees <code>filtered</code> on both ports, the bastion sees only 22 open, the app sees only 5432 open, and your awk prints <code>172.31.9.69 -> 172.31.9.12:3389</code> and nothing else.</p>
${giai('Hint: commands', bash(`
docker network create --internal --subnet 10.143.60.0/24 quet
docker run -d --name may --cap-add NET_ADMIN --network quet --ip 10.143.60.10 aws-c3-net:1 dropbear -R -F -E -p 22
docker run -d --name pg --network container:may -e POSTGRES_PASSWORD=chi-de-lab postgres:16-alpine
docker exec hacker nmap -Pn -sV -p 22,5432 10.143.60.10
docker exec may sh -c 'iptables -P INPUT DROP; iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
  iptables -A INPUT -p tcp --dport 22 -s 10.143.60.20 -j ACCEPT; iptables -A INPUT -p tcp --dport 5432 -s 10.143.60.30 -j ACCEPT'
awk '$13=="REJECT" && $8==6 {print $4, "->", $5":"$7}' flow-mau.txt`))}</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bastion host</span><span class="v">Jump box in a public subnet, SSH from a known IP only.</span></div>
  <div class="kv"><span class="k">Session Manager</span><span class="v">Shell and port forwarding through SSM; no inbound port; IAM + CloudTrail.</span></div>
  <div class="kv"><span class="k">SSM Agent</span><span class="v">Agent on the instance that connects outbound to Systems Manager.</span></div>
  <div class="kv"><span class="k">EC2 Instance Connect Endpoint</span><span class="v">SSH to private instances through a VPC endpoint, no bastion.</span></div>
  <div class="kv"><span class="k">Flow log</span><span class="v">Metadata of accepted/rejected IP flows; to CloudWatch Logs, S3 or Firehose.</span></div>
  <div class="kv"><span class="k">filtered (nmap)</span><span class="v">No answer — a firewall dropped the probe.</span></div>
  <div class="kv"><span class="k">CVE-2024-6387</span><span class="v">regreSSHion: unauthenticated RCE in OpenSSH server (Qualys, 07/2024).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>An open port is found in minutes and fingerprinted in seconds — we saw nmap read the SSH version.</li>
  <li>Bastion works but means an exposed port, keys and patching.</li>
  <li>Session Manager: zero inbound ports, IAM-controlled, every session audited.</li>
  <li>Flow logs record who tried what and whether it was accepted; REJECT-only is a cheap start.</li>
  <li>An ACCEPT in, REJECT out pair in flow logs means a stateless rule is missing.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html', '🖥️', 'AWS docs — AWS Systems Manager Session Manager', 'Setup, IAM, logging, port forwarding.')}
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html', '📜', 'AWS docs — Flow log records', 'Every field, default and custom formats.')}

<h3>Sources</h3>
<ul>
  <li>Session Manager: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html</a></li>
  <li>Starting sessions, port forwarding: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html</a></li>
  <li>EC2 Instance Connect Endpoint: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-using-eice.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-using-eice.html</a></li>
  <li>VPC Flow Logs: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html</a></li>
  <li>Flow log records: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html</a></li>
  <li>Flow log record examples (used in flow-mau.txt): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html</a></li>
  <li>masscan: <a href="https://github.com/robertdavidgraham/masscan" target="_blank" rel="noopener">github.com/robertdavidgraham/masscan</a></li>
  <li>Qualys, regreSSHion CVE-2024-6387 (01/07/2024): <a href="https://blog.qualys.com/vulnerabilities-threat-research/2024/07/01/regresshion-remote-unauthenticated-code-execution-vulnerability-in-openssh-server" target="_blank" rel="noopener">blog.qualys.com/…/regresshion-remote-unauthenticated-code-execution-vulnerability-in-openssh-server</a></li>
  <li>Unit 42 honeypots (22/11/2021): <a href="https://unit42.paloaltonetworks.com/exposed-services-public-clouds/" target="_blank" rel="noopener">unit42.paloaltonetworks.com/exposed-services-public-clouds/</a></li>
</ul>
</div>
`;

const L36_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 6</span>
<h2>3.6 — Vào máy private: bastion, Session Manager và flow log</h2>
<p class="lead">Bạn đã đặt cơ sở dữ liệu và API vào subnet private. Tốt — giờ một người vào đó lúc 2 giờ sáng để đọc log hay chạy truy vấn bằng cách nào? Câu trả lời cũ là một <strong>bastion host</strong> mở cổng 22. Câu trả lời hiện đại là <strong>không mở cổng nào cả</strong>: AWS Systems Manager Session Manager. Và khi có chuyện lạ, <strong>VPC Flow Logs</strong> cho biết ai đã gõ cửa nào. Bài này bắt đầu từ phía kẻ tấn công, bằng một lượt quét cổng thật, vì đó là lý lẽ mạnh nhất để đóng cổng.</p>

<h3>🔓 Góc hacker trước: máy quét thấy gì</h3>
<p>Ta chạy một máy quét thật, <strong>nmap</strong>, từ một container đóng vai kẻ tấn công, nhắm vào máy <code>10.143.60.10</code> đang mở SSH (cổng 22, Dropbear) và một PostgreSQL 16 thật (cổng 5432) cho cả mạng — tương đương một security group ghi <code>0.0.0.0/0</code> cho cả hai cổng. Rồi ta siết lại theo kiểu security group, và quét lại từ ba nơi:</p>
${OUT_36_VAOMAY_A}
<ul>
  <li>Lượt quét đầu mất 6 giây và cho kẻ tấn công biết không chỉ “22 và 5432 đang mở” mà cả <strong>phần mềm SSH và đúng phiên bản</strong>, và biết đó là PostgreSQL. Đó là danh sách đi chợ để chọn mã khai thác.</li>
  <li>Sau khi có luật, kẻ tấn công thấy cả hai cổng là <code>filtered</code>: gói tin biến mất, không ai trả lời. Bastion (<code>10.143.60.20</code>) chỉ thấy 22 mở; app (<code>10.143.60.30</code>) chỉ thấy 5432 mở. Mỗi tầng thấy đúng thứ nó cần — đó là chuỗi security group của bài 3.3 chạy trên gói tin thật.</li>
  <li>Bộ đếm <code>policy DROP 8 packets</code> là các gói dò của kẻ tấn công, bị vứt trong im lặng.</li>
</ul>
<p>Trên Internet thật chuyện này nhanh cỡ nào? Máy quét mã nguồn mở <strong>masscan</strong> tự giới thiệu là quét được toàn bộ Internet IPv4 trong chưa tới 5 phút. Honeypot của Unit 42 năm 2021 (bài 3.3) bị chiếm trong 24 giờ ở 80% trường hợp. Và tháng 7/2024 Qualys công bố <strong>regreSSHion (CVE-2024-6387)</strong>, lỗi cho chạy mã từ xa với quyền root trong máy chủ OpenSSH mà không cần đăng nhập, kèm con số <strong>hơn 14 triệu máy OpenSSH có thể bị ảnh hưởng đang mở ra Internet</strong>. Một cổng SSH mà Internet không tới được thì không dính lỗi kiểu đó ngay ngày đầu.</p>

<h3>Cách 1: bastion host (máy nhảy)</h3>
<ul>
  <li>Một máy EC2 nhỏ ở subnet public, mở cổng 22 <strong>chỉ cho IP văn phòng</strong>. Bạn SSH vào nó, rồi từ nó vào máy private: <code>ssh -J ec2-user@bastion ec2-user@10.0.11.25</code>.</li>
  <li>Máy private chỉ nhận 22 từ security group của bastion.</li>
  <li>Cái giá: một máy chạy suốt và một IPv4 công khai; khoá SSH phải phát, xoay vòng và thu hồi khi có người nghỉ việc; chính bastion phải được vá (nó đang mở ra ngoài); ghi lại ai đã gõ gì là việc của bạn.</li>
</ul>

<h3>Cách 2: Session Manager — không mở cổng vào nào</h3>
<ul>
  <li><strong>SSM Agent</strong> trên máy (cài sẵn trên Amazon Linux và các AMI Ubuntu gần đây) mở một kết nối HTTPS <strong>chiều ra</strong> tới dịch vụ Systems Manager. Bạn mở shell xuyên qua kết nối đó: <code>aws ssm start-session --target i-0123…</code>.</li>
  <li>Luật chiều vào: <strong>không có</strong>. Không cổng 22, không bastion, không khoá SSH. Quyền vào là một <strong>quyền IAM</strong> (<code>ssm:StartSession</code>), nên nó theo đúng chương 1: MFA, role, quyền tối thiểu, mất theo người dùng.</li>
  <li>Mọi phiên được ghi trong <strong>CloudTrail</strong>, và nội dung phiên có thể ghi ra S3 hoặc CloudWatch Logs — tính năng người kiểm toán thích nhất.</li>
  <li>Máy cần một instance profile role mang policy <code>AmazonSSMManagedInstanceCore</code> và một đường tới SSM: NAT gateway, hoặc ba interface endpoint (<code>ssm</code>, <code>ssmmessages</code>, <code>ec2messages</code>) cho subnet private hoàn toàn (chi phí: bài 3.4).</li>
  <li><strong>Chuyển tiếp cổng</strong> cho laptop của bạn tới cơ sở dữ liệu private mà không mở gì: tài liệu <code>AWS-StartPortForwardingSessionToRemoteHost</code> nối <code>localhost:5432</code> qua một máy tới endpoint RDS.</li>
  <li>Phương án cho công cụ cần SSH: <strong>EC2 Instance Connect Endpoint</strong> (2023) cho SSH vào máy private qua một endpoint trong VPC, cũng không cần bastion hay IP công khai.</li>
</ul>
${bash(`
# Mở shell vào máy private — không cổng 22, không khoá SSH (AWS thật; minh hoạ, không chạy được trên LocalStack)
aws ssm start-session --target i-0123456789abcdef0

# Nối localhost:5432 trên laptop tới RDS private qua máy đó
aws ssm start-session --target i-0123456789abcdef0 \\
  --document-name AWS-StartPortForwardingSessionToRemoteHost \\
  --parameters '{"host":["labflow-db.xxxx.ap-southeast-1.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["5432"]}'`)}
<p>Các lệnh này cần tài khoản AWS và máy thật — bản community của LocalStack không giả lập Session Manager — nên chỉ minh hoạ, không chạy. Chương 4 chạy chúng trên một máy free tier thật.</p>

<h3>VPC Flow Logs: ai đã gõ cửa nào</h3>
<ul>
  <li>Flow log ghi <strong>siêu dữ liệu</strong> của lưu lượng IP — nguồn, đích, cổng, giao thức, số byte, ACCEPT/REJECT — cho một VPC, một subnet hoặc một giao diện mạng. Nó <strong>không</strong> ghi nội dung gói tin.</li>
  <li>Nơi nhận: CloudWatch Logs, S3 hoặc Data Firehose. Loại lưu lượng: <code>ACCEPT</code>, <code>REJECT</code> hoặc <code>ALL</code>. Chỉ ghi <code>REJECT</code> là khởi đầu rẻ: thấy được máy quét và luật cấu hình sai.</li>
  <li>Không theo thời gian thực: bản ghi được gom theo một khoảng (mặc định 10 phút, hoặc 1 phút) rồi mới gửi.</li>
  <li>Có loại lưu lượng không bao giờ được ghi, ví dụ truy vấn tới máy chủ DNS của Amazon và yêu cầu tới dịch vụ metadata <code>169.254.169.254</code>.</li>
</ul>
${OUT_36_VAOMAY_B}
<ul>
  <li>LocalStack lưu cấu hình flow log nhưng, vì là trình giả lập, không sinh bản ghi nào. Nên ta đọc các <strong>bản ghi ví dụ trong tài liệu AWS</strong> bằng một dòng <code>awk</code> (trường 13 là hành động).</li>
  <li>Các trường của định dạng mặc định: phiên bản, tài khoản, giao diện, <strong>địa chỉ nguồn, địa chỉ đích, cổng nguồn, cổng đích, giao thức</strong> (6 = TCP, 1 = ICMP), số gói, số byte, bắt đầu, kết thúc, <strong>hành động</strong>, trạng thái ghi.</li>
  <li>Bản ghi 2: ai đó ở <code>172.31.9.69</code> thử RDP (3389) và bị từ chối — một lượt quét trông như vậy.</li>
  <li>Bản ghi 3–4 là bài học về stateless của chính tài liệu: một lệnh ping chiều vào (ICMP) được <strong>ACCEPT</strong>, nhưng câu trả lời đi ra bị <strong>REJECT</strong>. Security group đã tự cho câu trả lời ra; đây là một NACL thiếu luật chiều ra — đúng thất bại ta tái hiện ở bài 3.3.</li>
</ul>

<h3>Liên hệ đời thường và đi làm</h3>
<ul>
  <li><strong>Đời thường:</strong> bastion là quầy lễ tân ở cửa toà nhà — phải có người ngồi, soát thẻ và giữ tủ chìa khoá. Session Manager là máy quẹt thẻ nối với hệ thống nhân sự: nghỉ việc là thẻ hết tác dụng ở mọi cửa cùng lúc, và cửa nào bạn từng mở đều được ghi lại.</li>
  <li><strong>Đi làm:</strong> các buổi soát bảo mật ngày càng đánh trượt mọi thiết kế mở cổng 22 ra Internet. “Bọn em dùng Session Manager, không có SSH chiều vào” là câu họ muốn nghe. Khi có sự cố, câu hỏi đầu tiên là “cho xem flow log của giao diện đó”.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>“Cho kỹ sư vào shell của máy private bằng cách nào?”</strong> — Session Manager: không cổng vào, quản bằng IAM, ghi trong CloudTrail; role của máy có AmazonSSMManagedInstanceCore; NAT hoặc interface endpoint cho SSM.</li>
  <li><strong>“Bastion host là gì và nhược điểm?”</strong> — Máy nhảy được gia cố ở subnet public; nhược: cổng mở ra ngoài, quản lý khoá, phải vá, khó kiểm toán.</li>
  <li><strong>“VPC Flow Logs chứa gì, không chứa gì?”</strong> — Siêu dữ liệu kết nối (IP, cổng, giao thức, byte, chấp nhận/từ chối), không chứa nội dung; không theo thời gian thực; một số lưu lượng (DNS của Amazon, dịch vụ metadata) không được ghi.</li>
  <li><strong>“Kết nối vào được nhưng câu trả lời bị vứt. Flow log cho thấy thế nào?”</strong> — Một bản ghi ACCEPT chiều vào và một bản ghi REJECT cho câu trả lời: NACL stateless thiếu luật chiều ra.</li>
</ol>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Dựng phòng quét: một mạng Docker internal, một container đích chạy Dropbear ở 22 và một container PostgreSQL dùng chung mạng với nó (<code>--network container:…</code>), cùng các container “hacker”, “bastion”, “app” có IP cố định.</li>
  <li>Quét từ hacker bằng <code>nmap -Pn -sV</code>. Ghi lại bạn biết được gì về máy đích.</li>
  <li>Thêm luật iptables trên máy đích để 22 chỉ tới được từ bastion và 5432 chỉ từ app. Quét lại từ cả ba.</li>
  <li>Viết một dòng <code>awk</code> chỉ in các bản ghi TCP (giao thức 6) bị REJECT trong <code>flow-mau.txt</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> hacker thấy <code>filtered</code> ở cả hai cổng, bastion chỉ thấy 22 mở, app chỉ thấy 5432 mở, và lệnh awk in ra <code>172.31.9.69 -> 172.31.9.12:3389</code> và không gì khác.</p>
${giai('Gợi ý: các lệnh', bash(`
docker network create --internal --subnet 10.143.60.0/24 quet
docker run -d --name may --cap-add NET_ADMIN --network quet --ip 10.143.60.10 aws-c3-net:1 dropbear -R -F -E -p 22
docker run -d --name pg --network container:may -e POSTGRES_PASSWORD=chi-de-lab postgres:16-alpine
docker exec hacker nmap -Pn -sV -p 22,5432 10.143.60.10
docker exec may sh -c 'iptables -P INPUT DROP; iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
  iptables -A INPUT -p tcp --dport 22 -s 10.143.60.20 -j ACCEPT; iptables -A INPUT -p tcp --dport 5432 -s 10.143.60.30 -j ACCEPT'
awk '$13=="REJECT" && $8==6 {print $4, "->", $5":"$7}' flow-mau.txt`))}</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bastion host</span><span class="v">Máy nhảy ở subnet public, chỉ cho SSH từ một IP đã biết.</span></div>
  <div class="kv"><span class="k">Session Manager</span><span class="v">Shell và chuyển tiếp cổng qua SSM; không cổng vào; IAM + CloudTrail.</span></div>
  <div class="kv"><span class="k">SSM Agent</span><span class="v">Tác tử trên máy, kết nối chiều ra tới Systems Manager.</span></div>
  <div class="kv"><span class="k">EC2 Instance Connect Endpoint</span><span class="v">SSH vào máy private qua một endpoint trong VPC, không cần bastion.</span></div>
  <div class="kv"><span class="k">Flow log</span><span class="v">Siêu dữ liệu các luồng IP được chấp nhận/từ chối; gửi tới CloudWatch Logs, S3 hoặc Firehose.</span></div>
  <div class="kv"><span class="k">filtered (nmap)</span><span class="v">Không ai trả lời — tường lửa đã vứt gói dò.</span></div>
  <div class="kv"><span class="k">CVE-2024-6387</span><span class="v">regreSSHion: chạy mã từ xa không cần đăng nhập trong máy chủ OpenSSH (Qualys, 07/2024).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cổng mở bị tìm ra trong vài phút và bị nhận diện trong vài giây — ta đã thấy nmap đọc ra phiên bản SSH.</li>
  <li>Bastion dùng được nhưng kéo theo cổng mở, khoá và việc vá.</li>
  <li>Session Manager: không cổng vào nào, quản bằng IAM, mọi phiên đều được kiểm toán.</li>
  <li>Flow log ghi ai đã thử gì và có được chấp nhận không; chỉ ghi REJECT là khởi đầu rẻ.</li>
  <li>Một cặp ACCEPT chiều vào, REJECT chiều ra trong flow log nghĩa là thiếu một luật stateless.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html', '🖥️', 'Tài liệu AWS — AWS Systems Manager Session Manager', 'Cài đặt, IAM, ghi log, chuyển tiếp cổng.')}
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html', '📜', 'Tài liệu AWS — Bản ghi flow log', 'Mọi trường, định dạng mặc định và tuỳ chỉnh.')}

<h3>Nguồn</h3>
<ul>
  <li>Session Manager: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html</a></li>
  <li>Mở phiên, chuyển tiếp cổng: <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html" target="_blank" rel="noopener">docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html</a></li>
  <li>EC2 Instance Connect Endpoint: <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-using-eice.html" target="_blank" rel="noopener">docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-using-eice.html</a></li>
  <li>VPC Flow Logs: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html</a></li>
  <li>Bản ghi flow log: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html</a></li>
  <li>Ví dụ bản ghi flow log (dùng trong flow-mau.txt): <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html</a></li>
  <li>masscan: <a href="https://github.com/robertdavidgraham/masscan" target="_blank" rel="noopener">github.com/robertdavidgraham/masscan</a></li>
  <li>Qualys, regreSSHion CVE-2024-6387 (01/07/2024): <a href="https://blog.qualys.com/vulnerabilities-threat-research/2024/07/01/regresshion-remote-unauthenticated-code-execution-vulnerability-in-openssh-server" target="_blank" rel="noopener">blog.qualys.com/…/regresshion-remote-unauthenticated-code-execution-vulnerability-in-openssh-server</a></li>
  <li>Honeypot của Unit 42 (22/11/2021): <a href="https://unit42.paloaltonetworks.com/exposed-services-public-clouds/" target="_blank" rel="noopener">unit42.paloaltonetworks.com/exposed-services-public-clouds/</a></li>
</ul>
</div>
`;

/* ═════ 3.7 — Lab chương 3 ═════ */
const L37_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lab</span>
<h2>3.7 — Chapter 3 lab: a two-AZ network for LabFlow, graded by a script</h2>
<p class="lead">Time to build the network that every later chapter will place things into: a VPC across two Availability Zones with public and private subnets, a security-group chain, a free S3 endpoint, flow logs — and no NAT gateway, because a lab should not cost $43 a month. A grader script checks eight things. First you will watch it fail a “quick and dirty” setup, then build your own until it shows 8/8, tear everything down in the right order and prove nothing is still billing.</p>

<h3>The brief</h3>
<ul>
  <li>VPC <code>labflow-vpc</code>, CIDR <code>10.20.0.0/16</code>, region <code>ap-southeast-1</code>.</li>
  <li>Two public subnets (<code>10.20.1.0/24</code>, <code>10.20.2.0/24</code>) and two private subnets (<code>10.20.11.0/24</code>, <code>10.20.12.0/24</code>) spread over AZ <code>a</code> and <code>b</code>, tagged <code>Tier=public</code> / <code>Tier=private</code>.</li>
  <li>Public subnets reach the Internet through an IGW and auto-assign public IPs; private subnets have <strong>no</strong> route to the IGW — not even through the main table.</li>
  <li>Security groups <code>labflow-alb</code> (443 from anywhere) → <code>labflow-app</code> (8080 from alb) → <code>labflow-db</code> (5432 from app only). No group opens 22 or 5432 to the world.</li>
  <li>S3 gateway endpoint on the private route table; flow log on the VPC (REJECT is enough).</li>
  <li>Budget: $0 — LocalStack, or on a real account only free resources (VPC, subnets, route tables, IGW, SGs, gateway endpoint; flow logs cost only for the logs stored).</li>
</ul>

<h3>The grader</h3>
<p><code>cham.sh</code> only reads (<code>describe-*</code>), so it works against LocalStack and against a real account. Read it — every check is one idea from this chapter:</p>
${MA_CHAM}

<h3>Run it on the quick-and-dirty version first</h3>
<p>This is what a hurried first attempt often looks like: one subnet per tier in one AZ, the Internet route added to the <em>main</em> table, SSH and PostgreSQL opened to everyone:</p>
${MA_TRUOC}
${OUT_37_TRUOC}
<ul>
  <li>Only the VPC itself passes. Check 4 fails because the private subnet uses the main table, which now goes to the IGW: the “private” subnet is public.</li>
  <li>Check 5 fails because <code>labflow-db</code> accepts 5432 from an address range instead of from the app group; check 6 counts the two offending rules: 22 on <code>labflow-app</code> and 5432 on <code>labflow-db</code>, both from <code>0.0.0.0/0</code>.</li>
</ul>
<p>And deleting it the naive way fails, which is the second lesson of every network lab:</p>
${OUT_37_XOATHANG}

<div class="callout warn"><p><strong>Stop here and build your own.</strong> Write the commands (or the Terraform) yourself, run <code>cham.sh</code> after each step and watch the score rise. Open the solutions only when you are at 8/8 or truly stuck.</p></div>

${giai('Solution 1 — AWS CLI (giai.sh) and its run', MA_GIAI + OUT_37_GIAI)}
${giai('Solution 2 — the same network in Terraform (run on LocalStack, 19/11/2026)', MA_TF + `<p>LocalStack 4.12 rejected the <code>aws_flow_log</code> resource with every aggregation interval the provider sends (<code>InvalidParameter</code>), although AWS accepts it. For the local run we applied with <code>-var flow_log=false</code> and created the flow log with the CLI command from lesson 3.6; on a real account keep the default <code>true</code>.</p>` + OUT_37_TF)}

<h3>Clean up — in dependency order — and prove it</h3>
<p>A VPC cannot be deleted while anything is inside it (<code>DependencyViolation</code>). The order that always works: flow logs → endpoints → NAT gateways (then release Elastic IPs) → security group rules and groups → detach and delete the IGW → subnets → route tables (disassociate first) → the VPC → the log group. Then check every billable network item:</p>
${MA_DON}
${MA_CONGI}
<p>On a real account run <code>con-gi.sh</code> with <code>REGIONS="$(aws ec2 describe-regions --query 'Regions[].RegionName' --output text)"</code>: a NAT gateway forgotten in another region bills $43 a month quietly.</p>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Points</th><th>What</th></tr></thead>
  <tbody>
    <tr><td>8</td><td><code>cham.sh</code> shows 8/8 (one point per check)</td></tr>
    <tr><td>1</td><td>Your own design note: CIDR plan for 3 more environments with no overlap</td></tr>
    <tr><td>1</td><td>Clean-up proof: <code>con-gi.sh</code> output all zeros</td></tr>
  </tbody>
</table>

<h3>🎤 Five interview questions for this chapter</h3>
<ol>
  <li><strong>“Draw a production VPC for a web API with a PostgreSQL database.”</strong> — Two AZs; public subnets with the load balancer (and NAT if needed); private app subnets; private data subnets; SG chain alb → app → db; S3 gateway endpoint; flow logs. Name the costs: NAT per AZ, public IPv4.</li>
  <li><strong>“A new subnet you created is reachable from the Internet. Why might that be?”</strong> — It has no explicit route-table association and the main table has <code>0.0.0.0/0 → IGW</code>; or it auto-assigns public IPs. Fix: private main table, explicit associations.</li>
  <li><strong>“The API in a private subnet cannot reach a third-party API, but S3 works. What do you check?”</strong> — S3 goes through the gateway endpoint; Internet traffic needs <code>0.0.0.0/0 → NAT</code> in the private table, a NAT in a public subnet with an EIP, SG/NACL outbound. Also: the third party must whitelist the NAT's EIP.</li>
  <li><strong>“How would you cut the network cost of a dev environment?”</strong> — No NAT (or one shared NAT, or turn it off at night), S3/DynamoDB gateway endpoints, release unused Elastic IPs, no public IPs on instances, delete forgotten VPC endpoints in every region.</li>
  <li><strong>“Why does deleting a VPC fail, and how do you script the teardown?”</strong> — DependencyViolation while subnets, IGWs, endpoints, ENIs, SGs or NATs remain. Delete in dependency order, or let Terraform's dependency graph do it with <code>terraform destroy</code>.</li>
</ol>

<h3>🧪 Practice — this lab is the practice</h3>
<div class="callout ok"><p><strong>Done when:</strong> <code>cham.sh</code> prints <code>ĐIỂM 8/8</code> for your own build (CLI or Terraform), and after your clean-up <code>con-gi.sh</code> shows 0 for NAT, Elastic IP, VPC endpoint, Transit Gateway, VPN and custom VPCs.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Grader (cham.sh)</span><span class="v">Read-only describe calls turning the chapter into 8 checks.</span></div>
  <div class="kv"><span class="k">DependencyViolation</span><span class="v">Error when deleting a resource something still depends on.</span></div>
  <div class="kv"><span class="k">Teardown order</span><span class="v">Flow logs → endpoints → NAT/EIP → SGs → IGW → subnets → route tables → VPC.</span></div>
  <div class="kv"><span class="k">con-gi.sh</span><span class="v">Counts billable network items per region: NAT, EIP, endpoints, TGW, VPN, VPCs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The quick version scored 1/8: main-table IGW route and open ports are the classic mistakes.</li>
  <li>The full design passes 8/8 with zero hourly cost: no NAT, free S3 endpoint.</li>
  <li>Emulators differ from AWS (here: Terraform flow log) — note it, work around it, do not hide it.</li>
  <li>Tear down in dependency order and prove it with a billing check in every region.</li>
</ul>

<h3>📚 Learn deeper</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html', '🧭', 'AWS docs — How Amazon VPC works', 'Re-read it now: every term should be familiar.')}
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html', '🗺️', 'AWS docs — NAT gateway scenarios', 'The next step when the private tier needs the Internet.')}

<h3>Sources</h3>
<ul>
  <li>VPC how it works: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html</a></li>
  <li>Route tables: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html</a></li>
  <li>Security groups: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html</a></li>
  <li>Gateway endpoints: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html</a></li>
  <li>Flow logs: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html</a></li>
</ul>
</div>
`;

const L37_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Lab</span>
<h2>3.7 — Lab chương 3: mạng hai AZ cho LabFlow, chấm bằng script</h2>
<p class="lead">Đến lúc dựng mạng mà mọi chương sau sẽ đặt đồ vào: một VPC trải hai Availability Zone với subnet public và private, chuỗi security group, endpoint S3 miễn phí, flow log — và không NAT gateway, vì một bài lab không nên tốn 43 USD mỗi tháng. Một script chấm kiểm tám điều. Trước tiên bạn xem nó đánh trượt một bản dựng “làm vội”, rồi tự dựng cho tới khi nó báo 8/8, dỡ mọi thứ theo đúng thứ tự và chứng minh không còn gì đang tính tiền.</p>

<h3>Đề bài</h3>
<ul>
  <li>VPC <code>labflow-vpc</code>, CIDR <code>10.20.0.0/16</code>, region <code>ap-southeast-1</code>.</li>
  <li>Hai subnet public (<code>10.20.1.0/24</code>, <code>10.20.2.0/24</code>) và hai subnet private (<code>10.20.11.0/24</code>, <code>10.20.12.0/24</code>) rải ở AZ <code>a</code> và <code>b</code>, gắn tag <code>Tier=public</code> / <code>Tier=private</code>.</li>
  <li>Subnet public ra Internet qua IGW và tự gán IP công khai; subnet private <strong>không</strong> có route tới IGW — kể cả qua bảng main.</li>
  <li>Security group <code>labflow-alb</code> (443 từ mọi nơi) → <code>labflow-app</code> (8080 từ alb) → <code>labflow-db</code> (5432 chỉ từ app). Không group nào mở 22 hay 5432 cho cả thế giới.</li>
  <li>Gateway endpoint S3 gắn vào bảng định tuyến private; flow log cho VPC (REJECT là đủ).</li>
  <li>Ngân sách: 0 USD — LocalStack, hoặc trên tài khoản thật chỉ dùng tài nguyên miễn phí (VPC, subnet, bảng định tuyến, IGW, SG, gateway endpoint; flow log chỉ tốn tiền phần log lưu lại).</li>
</ul>

<h3>Bộ chấm</h3>
<p><code>cham.sh</code> chỉ đọc (<code>describe-*</code>), nên chạy được với LocalStack lẫn tài khoản thật. Hãy đọc nó — mỗi phép kiểm là một ý của chương này:</p>
${MA_CHAM}

<h3>Chạy thử trên bản làm vội trước</h3>
<p>Một lần thử đầu vội vàng thường trông thế này: mỗi tầng một subnet ở một AZ, route ra Internet thêm vào bảng <em>main</em>, SSH và PostgreSQL mở cho mọi người:</p>
${MA_TRUOC}
${OUT_37_TRUOC}
<ul>
  <li>Chỉ mỗi VPC qua. Phép 4 trượt vì subnet private dùng bảng main, mà bảng main giờ đi ra IGW: subnet “private” thành public.</li>
  <li>Phép 5 trượt vì <code>labflow-db</code> nhận 5432 từ một dải địa chỉ thay vì từ group app; phép 6 đếm hai luật vi phạm: 22 ở <code>labflow-app</code> và 5432 ở <code>labflow-db</code>, cả hai từ <code>0.0.0.0/0</code>.</li>
</ul>
<p>Và xoá theo kiểu ngây thơ thì thất bại — bài học thứ hai của mọi lab mạng:</p>
${OUT_37_XOATHANG}

<div class="callout warn"><p><strong>Dừng ở đây và tự dựng.</strong> Tự viết lệnh (hoặc Terraform), chạy <code>cham.sh</code> sau mỗi bước và nhìn điểm tăng lên. Chỉ mở lời giải khi bạn đã 8/8 hoặc thật sự bí.</p></div>

${giai('Lời giải 1 — AWS CLI (giai.sh) và lần chạy', MA_GIAI + OUT_37_GIAI)}
${giai('Lời giải 2 — cùng mạng đó bằng Terraform (chạy trên LocalStack, 19/11/2026)', MA_TF + `<p>LocalStack 4.12 từ chối tài nguyên <code>aws_flow_log</code> với mọi khoảng gom mà provider gửi (<code>InvalidParameter</code>), dù AWS nhận. Khi chạy cục bộ ta apply với <code>-var flow_log=false</code> rồi tạo flow log bằng lệnh CLI của bài 3.6; trên tài khoản thật giữ mặc định <code>true</code>.</p>` + OUT_37_TF)}

<h3>Dọn — theo thứ tự phụ thuộc — và chứng minh</h3>
<p>VPC không xoá được khi bên trong còn bất cứ thứ gì (<code>DependencyViolation</code>). Thứ tự luôn chạy được: flow log → endpoint → NAT gateway (rồi trả Elastic IP) → luật và security group → tháo và xoá IGW → subnet → bảng định tuyến (gỡ liên kết trước) → VPC → log group. Rồi kiểm mọi khoản mạng có tính tiền:</p>
${MA_DON}
${MA_CONGI}
<p>Trên tài khoản thật chạy <code>con-gi.sh</code> với <code>REGIONS="$(aws ec2 describe-regions --query 'Regions[].RegionName' --output text)"</code>: một NAT gateway bị quên ở region khác lặng lẽ tính 43 USD mỗi tháng.</p>

<h3>Thang chấm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Nội dung</th></tr></thead>
  <tbody>
    <tr><td>8</td><td><code>cham.sh</code> báo 8/8 (mỗi phép một điểm)</td></tr>
    <tr><td>1</td><td>Ghi chú thiết kế của bạn: quy hoạch CIDR cho thêm 3 môi trường không trùng nhau</td></tr>
    <tr><td>1</td><td>Bằng chứng đã dọn: output <code>con-gi.sh</code> toàn số 0</td></tr>
  </tbody>
</table>

<h3>🎤 Năm câu phỏng vấn của chương</h3>
<ol>
  <li><strong>“Vẽ một VPC production cho API web có cơ sở dữ liệu PostgreSQL.”</strong> — Hai AZ; subnet public chứa bộ cân bằng tải (và NAT nếu cần); subnet private cho ứng dụng; subnet private cho dữ liệu; chuỗi SG alb → app → db; gateway endpoint S3; flow log. Nêu luôn chi phí: NAT mỗi AZ, IPv4 công khai.</li>
  <li><strong>“Một subnet mới bạn tạo lại vào được từ Internet. Vì sao có thể như vậy?”</strong> — Nó không gắn bảng định tuyến riêng và bảng main có <code>0.0.0.0/0 → IGW</code>; hoặc nó tự gán IP công khai. Sửa: giữ bảng main private, gắn bảng tường minh.</li>
  <li><strong>“API ở subnet private không gọi được API bên thứ ba, nhưng S3 thì được. Kiểm gì?”</strong> — S3 đi gateway endpoint; lưu lượng Internet cần <code>0.0.0.0/0 → NAT</code> trong bảng private, NAT ở subnet public có EIP, SG/NACL chiều ra. Thêm: bên thứ ba phải cho phép EIP của NAT.</li>
  <li><strong>“Cắt chi phí mạng của môi trường dev thế nào?”</strong> — Không NAT (hoặc một NAT dùng chung, hoặc tắt ban đêm), gateway endpoint cho S3/DynamoDB, trả Elastic IP không dùng, không gán IP công khai cho máy, xoá VPC endpoint bị quên ở mọi region.</li>
  <li><strong>“Vì sao xoá VPC thất bại, và viết script dỡ thế nào?”</strong> — DependencyViolation khi còn subnet, IGW, endpoint, ENI, SG hay NAT. Xoá theo thứ tự phụ thuộc, hoặc để đồ thị phụ thuộc của Terraform làm hộ bằng <code>terraform destroy</code>.</li>
</ol>

<h3>🧪 Thực hành — chính lab này là bài thực hành</h3>
<div class="callout ok"><p><strong>Đạt khi:</strong> <code>cham.sh</code> in <code>ĐIỂM 8/8</code> cho bản dựng của chính bạn (CLI hoặc Terraform), và sau khi dọn, <code>con-gi.sh</code> báo 0 cho NAT, Elastic IP, VPC endpoint, Transit Gateway, VPN và VPC tự tạo.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bộ chấm (cham.sh)</span><span class="v">Các lệnh describe chỉ-đọc biến cả chương thành 8 phép kiểm.</span></div>
  <div class="kv"><span class="k">DependencyViolation</span><span class="v">Lỗi khi xoá một tài nguyên còn thứ khác phụ thuộc vào.</span></div>
  <div class="kv"><span class="k">Thứ tự dỡ</span><span class="v">Flow log → endpoint → NAT/EIP → SG → IGW → subnet → bảng định tuyến → VPC.</span></div>
  <div class="kv"><span class="k">con-gi.sh</span><span class="v">Đếm các khoản mạng tính tiền theo region: NAT, EIP, endpoint, TGW, VPN, VPC.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bản làm vội được 1/8: route IGW ở bảng main và cổng mở là hai lỗi kinh điển.</li>
  <li>Thiết kế đầy đủ qua 8/8 mà không tốn đồng nào theo giờ: không NAT, endpoint S3 miễn phí.</li>
  <li>Trình giả lập khác AWS (ở đây: flow log qua Terraform) — ghi lại, đi đường vòng, đừng giấu.</li>
  <li>Dỡ theo thứ tự phụ thuộc và chứng minh bằng một lượt kiểm tiền ở mọi region.</li>
</ul>

<h3>📚 Học sâu hơn</h3>
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html', '🧭', 'Tài liệu AWS — Amazon VPC hoạt động thế nào', 'Đọc lại ngay bây giờ: thuật ngữ nào cũng phải quen.')}
${tl('https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html', '🗺️', 'Tài liệu AWS — Các kịch bản NAT gateway', 'Bước tiếp theo khi tầng private cần Internet.')}

<h3>Nguồn</h3>
<ul>
  <li>VPC hoạt động thế nào: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html</a></li>
  <li>Bảng định tuyến: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html</a></li>
  <li>Security group: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html</a></li>
  <li>Gateway endpoint: <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html</a></li>
  <li>Flow log: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html" target="_blank" rel="noopener">docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html</a></li>
</ul>
</div>
`;

/* ═════ 3.8 — Kiểm tra + export ═════ */
const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ3 = [
  Q('How many usable IPv4 addresses does a /24 subnet give you on AWS?|||Subnet /24 trên AWS cho bạn bao nhiêu địa chỉ IPv4 dùng được?', [
    '256|||256',
    '254, like a home network|||254, như mạng ở nhà',
    '251, because AWS reserves five addresses|||251, vì AWS giữ năm địa chỉ',
    '250|||250',
  ], 2),
  Q('Why is choosing 172.17.0.0/16 for a VPC risky for a backend team?|||Vì sao chọn 172.17.0.0/16 cho VPC là rủi ro với nhóm backend?', [
    'It is not a private range|||Nó không phải dải riêng',
    'It overlaps Docker’s default bridge network, so containers may not reach parts of the VPC|||Nó trùng mạng bridge mặc định của Docker, nên container có thể không tới được một phần VPC',
    'AWS reserves it for the default VPC in every account|||AWS giữ nó cho VPC mặc định ở mọi tài khoản',
    'It is larger than /16|||Nó lớn hơn /16',
  ], 1),
  Q('What makes a subnet "public"?|||Điều gì làm một subnet thành "public"?', [
    'A checkbox "public" when creating the subnet|||Ô đánh dấu "public" khi tạo subnet',
    'Its route table sends 0.0.0.0/0 to an Internet gateway (and resources get public IPs)|||Bảng định tuyến của nó đưa 0.0.0.0/0 tới Internet gateway (và tài nguyên có IP công khai)',
    'It is in the first Availability Zone|||Nó nằm ở Availability Zone đầu tiên',
    'Its NACL allows all traffic|||NACL của nó cho phép mọi lưu lượng',
  ], 1),
  Q('You add 0.0.0.0/0 → igw to the MAIN route table. What is the danger?|||Bạn thêm 0.0.0.0/0 → igw vào bảng định tuyến MAIN. Nguy hiểm ở đâu?', [
    'None, the main table is only used by the VPC router|||Không có, bảng main chỉ dành cho router của VPC',
    'Every subnet without an explicit association, including future ones, becomes public|||Mọi subnet không gắn bảng riêng, kể cả subnet tạo sau này, đều thành public',
    'The Internet gateway is detached|||Internet gateway bị tháo ra',
    'NAT gateways stop working|||NAT gateway ngừng chạy',
  ], 1),
  Q('A NACL allows inbound 443, but HTTPS requests time out. What is missing?|||NACL cho 443 chiều vào, nhưng yêu cầu HTTPS bị chờ hết giờ. Thiếu gì?', [
    'An inbound rule for port 80|||Luật chiều vào cho cổng 80',
    'An outbound rule to the clients’ ephemeral ports (1024–65535), because NACLs are stateless|||Luật chiều ra tới cổng tạm của máy khách (1024–65535), vì NACL là stateless',
    'A security group deny rule|||Một luật deny trong security group',
    'A NAT gateway|||Một NAT gateway',
  ], 1),
  Q('How should the database security group allow the API, without hard-coding IPs?|||Security group của cơ sở dữ liệu nên cho API vào thế nào mà không ghi cứng IP?', [
    'Allow 5432 from 0.0.0.0/0 and rely on the password|||Cho 5432 từ 0.0.0.0/0 và dựa vào mật khẩu',
    'Allow 5432 from the VPC CIDR|||Cho 5432 từ CIDR của VPC',
    'Allow 5432 with the API’s security group as the source|||Cho 5432 với nguồn là security group của API',
    'Use a NACL deny for every other IP|||Dùng NACL deny cho mọi IP khác',
  ], 2),
  Q('In the NAT lab, which source address did the outside nginx server log?|||Trong lab NAT, máy chủ nginx bên ngoài ghi địa chỉ nguồn nào?', [
    'The private machine’s 10.143.1.10|||Địa chỉ 10.143.1.10 của máy private',
    'The NAT box’s outside address 10.143.200.254|||Địa chỉ phía ngoài của hộp NAT 10.143.200.254',
    '127.0.0.1|||127.0.0.1',
    'Nothing, the request failed|||Không gì cả, yêu cầu thất bại',
  ], 1),
  Q('What is the cheapest way for private subnets to reach S3 without a NAT gateway?|||Cách rẻ nhất để subnet private tới S3 mà không cần NAT gateway?', [
    'An S3 gateway endpoint on the private route table (free)|||Gateway endpoint S3 gắn vào bảng định tuyến private (miễn phí)',
    'An interface endpoint in every AZ|||Interface endpoint ở mọi AZ',
    'A Transit Gateway|||Một Transit Gateway',
    'Public IPs on the private instances|||IP công khai cho các máy private',
  ], 0),
  Q('VPC A is peered with B, and B with C. Can A reach C?|||VPC A peering với B, B peering với C. A tới được C không?', [
    'Yes, through B automatically|||Có, tự động qua B',
    'Yes, if A adds a route to C via the A–B peering|||Có, nếu A thêm route tới C qua peering A–B',
    'No, peering is not transitive; peer A–C or use a Transit Gateway|||Không, peering không bắc cầu; peering A–C hoặc dùng Transit Gateway',
    'Only if all three share one CIDR|||Chỉ khi cả ba dùng chung một CIDR',
  ], 2),
  Q('Which is the best way to give engineers a shell on private EC2 instances?|||Cách tốt nhất để kỹ sư vào shell của máy EC2 private?', [
    'Open port 22 to 0.0.0.0/0 with strong passwords|||Mở cổng 22 cho 0.0.0.0/0 với mật khẩu mạnh',
    'Session Manager: no inbound port, IAM-controlled, sessions logged in CloudTrail|||Session Manager: không cổng vào, quản bằng IAM, phiên ghi trong CloudTrail',
    'Give every instance a public IP|||Cấp IP công khai cho mọi máy',
    'A NAT gateway with port forwarding|||NAT gateway có chuyển tiếp cổng',
  ], 1),
];

export default {
  title: 'Chapter 3 — Networking: VPC|||Chương 3 — Mạng: VPC',
  description: 'VPC, CIDR và subnet (tính bằng Python, 5 địa chỉ bị giữ, trùng dải với Docker); bảng định tuyến, Internet gateway, public = route + IP; security group stateful vs NACL stateless xem trên gói tin thật; NAT bằng MASQUERADE và phép tính tiền NAT/endpoint; peering không bắc cầu, Transit Gateway, VPN, Direct Connect; quét cổng bằng nmap, Session Manager, flow log; lab mạng hai AZ chấm 8 phép bằng CLI và Terraform.',
  lessons: [
    {
      title: '3.1 — VPC, CIDR and subnets|||3.1 — VPC, CIDR và subnet',
      slug: 'aws-3-1-vpc-subnet',
      type: 'LESSON',
      isFreePreview: true,
      description: 'VPC là mạng riêng miễn phí trong một region, tính CIDR bằng Python, năm địa chỉ AWS giữ, trùng dải (kể cả 172.17 của Docker), subnet một AZ, bố cục ba tầng hai AZ, VPC mặc định, lỗi InvalidSubnet (chạy thật).',
      content: L31_EN + L31_VI,
    },
    {
      title: '3.2 — Route tables and the Internet gateway: public vs private|||3.2 — Bảng định tuyến và Internet gateway: public vs private',
      slug: 'aws-3-2-route-igw',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Route local, bảng main và bảng riêng, IGW dịch một-đổi-một, public = route + IP công khai, bẫy route IGW ở bảng main, route local vs default trên mạng Docker thật, phí IPv4 từ 2024, egress-only IGW.',
      content: L32_EN + L32_VI,
    },
    {
      title: '3.3 — Security groups and NACLs|||3.3 — Security group và NACL',
      slug: 'aws-3-3-security-group',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chuỗi SG alb → app → db tham chiếu nhau, NACL đánh số và cổng tạm, stateful vs stateless chạy thật bằng iptables, so với ufw và cổng Docker, honeypot Unit 42 2021 (96% Postgres trong 30 giây).',
      content: L33_EN + L33_VI,
    },
    {
      title: '3.4 — NAT gateways and VPC endpoints|||3.4 — NAT gateway và VPC endpoint',
      slug: 'aws-3-4-nat-endpoint',
      type: 'LESSON',
      isFreePreview: true,
      description: 'NAT một chiều chạy thật bằng MASQUERADE (máy chủ thấy IP của NAT), NAT theo AZ, phép tính tiền NAT/EIP/endpoint ở Singapore, gateway endpoint S3 miễn phí, interface endpoint không tự động rẻ hơn.',
      content: L34_EN + L34_VI,
    },
    {
      title: '3.5 — Connecting networks: peering, Transit Gateway, VPN|||3.5 — Nối các mạng: peering, Transit Gateway, VPN',
      slug: 'aws-3-5-ket-noi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Peering A–B–C và bẫy bắc cầu (chạy trên LocalStack), CIDR trùng, Transit Gateway trục-nan hoa và giá, Site-to-Site VPN, Client VPN, Direct Connect, bảng chọn cho đề thi.',
      content: L35_EN + L35_VI,
    },
    {
      title: '3.6 — Reaching private machines: bastion, SSM and flow logs|||3.6 — Vào máy private: bastion, SSM và flow logs',
      slug: 'aws-3-6-vao-may',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Quét cổng thật bằng nmap trước/sau khi siết, masscan, regreSSHion 2024, bastion và nhược điểm, Session Manager không cổng vào, chuyển tiếp cổng tới RDS, flow log và đọc bản ghi bằng awk.',
      content: L36_EN + L36_VI,
    },
    {
      title: '3.7 — Chapter 3 lab + interview questions|||3.7 — Lab chương 3 + câu hỏi phỏng vấn',
      slug: 'aws-3-7-lab-3',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mạng hai AZ cho LabFlow không NAT: bộ chấm 8 phép (bản vội 1/8 → 8/8), DependencyViolation và thứ tự dỡ, lời giải CLI và Terraform, kiểm "còn gì đang tính tiền", năm câu phỏng vấn.',
      content: L37_EN + L37_VI,
    },
    {
      title: '3.8 — Chapter 3 quiz|||3.8 — Kiểm tra Chương 3',
      slug: 'aws-3-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về 5 địa chỉ bị giữ, trùng dải Docker, subnet public, bảng main, NACL stateless, tham chiếu SG, NAT, gateway endpoint, peering không bắc cầu và Session Manager.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question comes from an output you saw in this chapter. If you miss one, rerun that part of the lab and read the output again.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Câu nào cũng lấy từ một output bạn đã thấy trong chương này. Sai câu nào, chạy lại phần lab đó và đọc lại output.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ3 },
    },
  ],
};
