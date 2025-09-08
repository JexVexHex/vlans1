# Tiny Tutorial™ — VLANs & VLAN Tagging

This Tiny Tutorial™ covers the fundamentals of Virtual LANs (VLANs), how VLAN tags work (IEEE 802.1Q), and basic Cisco IOS commands for VLAN configuration and verification.

---

## What is a VLAN?

- **VLAN (Virtual Local Area Network)**: a logical segmentation of a switch into separate broadcast domains. Devices in different VLANs cannot directly exchange Ethernet frames without routing.
- **Benefits**: traffic isolation, improved security, reduced broadcast domains, better traffic management.

## VLAN types and use-cases

- **Access VLAN**: A single VLAN assigned to an access port (end host). The switch port accepts untagged frames and associates them with the configured access VLAN.
- **Trunk VLAN**: A trunk port carries frames for multiple VLANs between switches (or to routers). Trunks typically use 802.1Q tagging.
- **Native VLAN**: On an 802.1Q trunk, the native VLAN sends untagged frames. Default is VLAN 1 on many Cisco switches — change it for security.

## IEEE 802.1Q VLAN tag (high level)

When 802.1Q tagging is used, a 4-byte VLAN tag is inserted into the Ethernet frame after the source MAC and before the EtherType/Length field. The tag structure (4 bytes):

- 2 bytes: Tag Protocol Identifier (TPID) — typically 0x8100
- 2 bytes: Tag Control Information (TCI)
  - 3 bits: Priority Code Point (PCP) — QoS priority
  - 1 bit: Drop Eligible Indicator (DEI)
  - 12 bits: VLAN Identifier (VID) — ranges 0-4095, usable VLAN IDs typically 1-4094

Key notes:
- Frames with no 802.1Q tag are considered untagged and belong to the access VLAN (or native VLAN on trunk links).
- The VLAN ID (VID) inside the tag determines the logical VLAN membership for forwarding decisions.

## Common Cisco IOS VLAN commands (quick cheatsheet)

Enter global configuration and VLAN creation:

```text
Switch> enable
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config-vlan)# exit
```

Assign an access port to a VLAN:

```text
Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

Configure a trunk port (802.1Q):

```text
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport trunk encapsulation dot1q   ! if supported (older platforms)
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 99         ! change native for security
Switch(config-if)# switchport trunk allowed vlan 10,20,99
Switch(config-if)# exit
```

Verify VLANs and trunking:

```text
Switch# show vlan brief
Switch# show interfaces trunk
Switch# show running-config | include interface|switchport|vlan
Switch# show mac address-table dynamic | include Vlan
```

Removing a VLAN (careful — this affects ports assigned to it):

```text
Switch(config)# no vlan 10
```

Helpful operational tips:

- Avoid using VLAN 1 for user traffic; reserve it for management or change the native VLAN.
- Lock down trunk ports with `switchport trunk allowed vlan` and set an explicit native VLAN.
- Document VLAN IDs and names in your network documentation.
- Use `show interfaces trunk` to confirm which VLANs are flowing on trunk links.

## Example scenario

- VLAN 10: Sales
- VLAN 20: Engineering
- VLAN 99: Native/Management

Switch A needs a trunk to Switch B where both Sales and Engineering must exchange traffic; configure the uplink as trunk and allow VLANs 10 and 20. Ensure access ports for hosts are configured as `switchport mode access` and `switchport access vlan <id>`.

## Further reading

- IEEE 802.1Q specification (tagging): http://standards.ieee.org
- Cisco VLAN configuration guides: https://www.cisco.com

---

End of Tiny Tutorial™

