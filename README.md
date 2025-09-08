# Tiny VLAN Tutorial

This repository contains a short, practical tutorial on VLANs (Virtual Local Area Networks) and VLAN tagging using IEEE 802.1Q, with quick Cisco IOS command examples for configuration and verification.

- **Topic**: VLAN basics, 802.1Q tagging, access vs trunk ports, native VLANs
- **Audience**: Network engineers, students, or anyone learning switch VLAN configuration

Contents
- `tiny-vlan-tutorial.md` — the full tutorial used to create this README
- `index.html`, `styles.css`, `app.js` — demo assets in the repo

Quick highlights
- VLANs segment a switch into separate broadcast domains for isolation and better traffic management.
- Access ports accept untagged frames and map them to a single VLAN.
- Trunk ports carry frames for multiple VLANs using 802.1Q tags; the native VLAN travels untagged.
- 802.1Q inserts a 4-byte tag containing TPID (0x8100) and TCI (PCP, DEI, VID).

Cisco IOS cheatsheet (examples)

```text
Switch> enable
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config-vlan)# exit

Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# no shutdown
Switch(config-if)# exit

Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport trunk encapsulation dot1q
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# switchport trunk allowed vlan 10,20,99
Switch(config-if)# exit

Switch# show vlan brief
Switch# show interfaces trunk
Switch# show running-config | include interface|switchport|vlan
Switch# show mac address-table dynamic | include Vlan
```

Operational tips
- Avoid using VLAN 1 for user traffic; change the native VLAN for security.
- Restrict trunk VLANs via `switchport trunk allowed vlan`.
- Document VLAN IDs and names in your network documentation.

Example topology

- VLAN 10 — Sales
- VLAN 20 — Engineering
- VLAN 99 — Native/Management

Connect switches with a trunk that allows VLANs 10 and 20, and configure host access ports with `switchport mode access` and `switchport access vlan <id>`.

Further reading
- IEEE 802.1Q specification: `http://standards.ieee.org`
- Cisco VLAN guides: `https://www.cisco.com`

---

End of README


