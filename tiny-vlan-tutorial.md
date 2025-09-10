# Tiny Tutorial™ — VLANs & VLAN Tagging
*A Comprehensive Guide to Virtual Local Area Networks*

---

## Table of Contents
1. [VLAN Fundamentals](#vlan-fundamentals)
2. [Broadcast Domains & Layer 2 Switching](#broadcast-domains--layer-2-switching)
3. [IEEE 802.1Q VLAN Tagging](#ieee-8021q-vlan-tagging)
4. [Access vs Trunk Ports](#access-vs-trunk-ports)
5. [Native VLAN & Security](#native-vlan--security)
6. [Cisco VLAN Configuration](#cisco-vlan-configuration)
7. [Inter-VLAN Routing](#inter-vlan-routing)
8. [VLAN Design Best Practices](#vlan-design-best-practices)
9. [Troubleshooting VLANs](#troubleshooting-vlans)
10. [Hands-On Lab Exercises](#hands-on-lab-exercises)

---

## VLAN Fundamentals

### What is a VLAN?
A **Virtual Local Area Network (VLAN)** is a logical subdivision of a physical network that creates separate broadcast domains. VLANs allow you to segment a network logically rather than physically.

**Key Benefits:**
- **Broadcast Domain Isolation**: Reduces broadcast traffic and network congestion
- **Enhanced Security**: Isolates sensitive traffic from general network traffic
- **Improved Performance**: Smaller broadcast domains mean better network performance
- **Flexible Network Design**: Devices can be grouped logically regardless of physical location
- **Cost Efficiency**: One physical switch can support multiple logical networks

### VLAN Types
1. **Data VLANs**: Carry user-generated traffic (most common)
2. **Voice VLANs**: Dedicated to VoIP traffic with QoS priorities
3. **Management VLANs**: Used for switch management and administrative access
4. **Native VLANs**: Handle untagged traffic on trunk links
5. **Default VLANs**: VLAN 1 (all ports belong to this by default)

---

## Broadcast Domains & Layer 2 Switching

### Without VLANs
In a traditional switched network without VLANs:
- All ports on a switch belong to the same broadcast domain
- Broadcast frames reach every device on the network
- No logical separation between different departments/functions

### With VLANs
VLANs create multiple broadcast domains on a single switch:
- Each VLAN is its own broadcast domain
- Broadcast traffic is contained within the VLAN
- Devices in different VLANs cannot communicate without routing

**Example Scenario:**
```
Switch with 24 ports:
- Ports 1-8: VLAN 10 (Sales Department)
- Ports 9-16: VLAN 20 (Engineering Department)  
- Ports 17-24: VLAN 30 (Management)
```

---

## IEEE 802.1Q VLAN Tagging

### Tag Structure
The IEEE 802.1Q standard defines a 4-byte VLAN tag inserted into Ethernet frames:

```
Original Ethernet Frame:
[Dest MAC][Src MAC][EtherType/Length][Data][FCS]

802.1Q Tagged Frame:
[Dest MAC][Src MAC][VLAN Tag][EtherType/Length][Data][FCS]
```

### VLAN Tag Fields (4 bytes total)
1. **TPID (Tag Protocol Identifier)** - 2 bytes
   - Value: 0x8100 (indicates 802.1Q tag)
   
2. **TCI (Tag Control Information)** - 2 bytes
   - **PCP (Priority Code Point)** - 3 bits: QoS priority (0-7)
   - **DEI (Drop Eligible Indicator)** - 1 bit: Can this frame be dropped?
   - **VID (VLAN Identifier)** - 12 bits: VLAN ID (1-4094)

### VLAN ID Ranges
- **0**: Not used
- **1**: Default VLAN (typically management)
- **2-1001**: Normal range VLANs
- **1002-1005**: Legacy (Token Ring, FDDI)
- **1006-4094**: Extended range VLANs
- **4095**: Reserved

---

## Access vs Trunk Ports

### Access Ports
**Purpose**: Connect end devices (PCs, printers, servers)
**Characteristics**:
- Carry traffic for only ONE VLAN
- Send/receive untagged frames
- Add VLAN tag when forwarding to trunk ports
- Remove VLAN tag when sending to end device

**When to Use**: Connecting end user devices, servers, access points

### Trunk Ports  
**Purpose**: Connect switches to other switches or routers
**Characteristics**:
- Carry traffic for MULTIPLE VLANs
- Use VLAN tags to identify traffic
- Native VLAN traffic is untagged
- All other VLAN traffic is tagged

**When to Use**: Inter-switch links, connections to routers for inter-VLAN routing

### Frame Handling
```
Access Port Example:
PC → Switch (untagged) → Add VLAN tag → Forward to trunk

Trunk Port Example:
Switch A → Tagged frames → Switch B → Remove tag if access port
```

---

## Native VLAN & Security

### Native VLAN Concept
The **Native VLAN** is the VLAN that handles untagged traffic on a trunk port.
- Default: VLAN 1 on Cisco switches
- Frames belonging to native VLAN are sent untagged across trunk
- Both ends of trunk must have same native VLAN

### Security Considerations
**VLAN 1 Risks**:
- Default native VLAN is VLAN 1
- Management traffic often uses VLAN 1
- Potential for VLAN hopping attacks

**Best Practices**:
1. Change native VLAN from default VLAN 1
2. Use unused VLAN as native (e.g., VLAN 99)
3. Don't assign any access ports to native VLAN
4. Explicitly configure native VLAN on both trunk ends

---

## Cisco VLAN Configuration

### Basic VLAN Creation
```cisco
! Enter global configuration
Switch> enable
Switch# configure terminal

! Create VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config-vlan)# exit

Switch(config)# vlan 20  
Switch(config-vlan)# name ENGINEERING
Switch(config-vlan)# exit

Switch(config)# vlan 99
Switch(config-vlan)# name NATIVE
Switch(config-vlan)# exit
```

### Access Port Configuration
```cisco
! Configure access ports
Switch(config)# interface range FastEthernet0/1-8
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# spanning-tree portfast
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit

Switch(config)# interface range FastEthernet0/9-16
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# spanning-tree portfast
Switch(config-if-range)# no shutdown
Switch(config-if-range)# exit
```

### Trunk Port Configuration
```cisco
! Configure trunk port
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk encapsulation dot1q
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# switchport trunk allowed vlan 10,20,99
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

### Verification Commands
```cisco
! Show VLAN database
Switch# show vlan brief

! Show VLAN details
Switch# show vlan id 10

! Show trunk ports
Switch# show interfaces trunk

! Show specific interface
Switch# show interfaces FastEthernet0/1 switchport

! Show MAC address table by VLAN
Switch# show mac address-table vlan 10

! Show running configuration for interfaces
Switch# show running-config | section interface
```

---

## Inter-VLAN Routing

### Why Inter-VLAN Routing?
VLANs create separate broadcast domains, so devices in different VLANs cannot communicate without a router.

### Methods

#### 1. Router on a Stick (Most Common)
```cisco
! Router configuration
Router(config)# interface GigabitEthernet0/1
Router(config-if)# no ip address
Router(config-if)# no shutdown

! Subinterfaces for each VLAN
Router(config)# interface GigabitEthernet0/1.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0

Router(config)# interface GigabitEthernet0/1.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
```

#### 2. Switch Virtual Interfaces (SVI) - Layer 3 Switches
```cisco
! Enable IP routing
Switch(config)# ip routing

! Create SVIs
Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown
```

---

## VLAN Design Best Practices

### Planning VLANs
1. **Document Everything**: Maintain VLAN ID assignments and naming conventions
2. **Reserve VLAN Ranges**: 
   - 1-99: Infrastructure (management, native)
   - 100-199: User VLANs
   - 200-299: Voice VLANs
   - 300-399: Guest/DMZ
3. **Consistent Naming**: Use descriptive names (SALES_VLAN, ENG_VLAN)

### Security Best Practices
1. **Change Default Native VLAN**: Don't use VLAN 1
2. **Prune Unnecessary VLANs**: Use `switchport trunk allowed vlan`
3. **Disable Unused Ports**: Assign to unused VLAN and shutdown
4. **VLAN Access Control**: Use access lists on SVIs

### Performance Considerations
1. **Right-Size VLANs**: Don't make VLANs too large (broadcast concerns)
2. **Strategic Trunk Placement**: Minimize unnecessary VLAN traffic
3. **Load Balancing**: Distribute VLANs across multiple trunks if needed

---

## Troubleshooting VLANs

### Common Issues

#### 1. VLAN Mismatch
**Symptoms**: No connectivity between switches
**Cause**: Different native VLANs on trunk ends
**Solution**:
```cisco
! Check native VLAN on both ends
Switch# show interfaces trunk

! Verify and correct
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport trunk native vlan 99
```

#### 2. Missing VLAN on Trunk
**Symptoms**: VLAN works locally but not across trunk
**Solution**:
```cisco
! Check allowed VLANs
Switch# show interfaces trunk

! Add missing VLAN
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport trunk allowed vlan add 30
```

#### 3. Wrong Access VLAN Assignment
**Symptoms**: Device can't communicate with others in same VLAN
**Solution**:
```cisco
! Check port VLAN assignment
Switch# show interfaces FastEthernet0/5 switchport

! Correct assignment
Switch(config)# interface FastEthernet0/5
Switch(config-if)# switchport access vlan 10
```

### Troubleshooting Commands
```cisco
! VLAN troubleshooting toolkit
show vlan brief
show vlan id [vlan-number]
show interfaces trunk
show interfaces [interface] switchport
show mac address-table
show mac address-table vlan [vlan-number]
show spanning-tree vlan [vlan-number]
debug sw-vlan packets
```

---

## Hands-On Lab Exercises

### Lab 1: Basic VLAN Configuration
**Objective**: Create VLANs and assign access ports

**Scenario**: Configure a switch with:
- VLAN 10: Sales (ports 1-5)
- VLAN 20: IT (ports 6-10)
- VLAN 99: Native

**Tasks**:
1. Create the VLANs with appropriate names
2. Assign access ports to VLANs
3. Verify configuration with show commands

### Lab 2: Trunk Configuration
**Objective**: Configure inter-switch trunk

**Scenario**: Connect two switches with trunk carrying VLANs 10, 20, 99

**Tasks**:
1. Configure trunk ports on both switches
2. Set native VLAN to 99
3. Allow only necessary VLANs
4. Verify trunk operation

### Lab 3: Inter-VLAN Routing
**Objective**: Enable communication between VLANs

**Scenario**: Configure router-on-a-stick for VLANs 10 and 20

**Tasks**:
1. Configure subinterfaces on router
2. Assign IP addresses to each VLAN
3. Test connectivity between VLANs
4. Verify routing table

### Lab 4: VLAN Troubleshooting
**Objective**: Identify and resolve VLAN issues

**Scenario**: Given a misconfigured network, identify issues:
- Native VLAN mismatch
- Missing VLAN on trunk
- Incorrect access port assignment

**Tasks**:
1. Use show commands to identify issues
2. Correct each configuration problem
3. Verify end-to-end connectivity

---

## Summary

VLANs are essential for modern network design, providing:
- **Logical segmentation** without physical separation
- **Improved security** through traffic isolation
- **Better performance** via smaller broadcast domains
- **Flexible design** allowing logical grouping

**Key Takeaways**:
1. VLANs create separate broadcast domains
2. 802.1Q tagging enables multiple VLANs on single links
3. Access ports serve single VLANs, trunk ports serve multiple
4. Native VLAN security is critical
5. Inter-VLAN routing enables communication between VLANs
6. Proper planning and documentation are essential

**Next Steps**:
- Practice hands-on configuration
- Explore advanced topics: VTP, VLAN trunking protocols
- Study network design patterns using VLANs
- Implement VLAN security best practices

---

*End of Tiny Tutorial™*

