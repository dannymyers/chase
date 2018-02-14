#sudo sh InstallServices.sh
#Web
cp Web.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Web.service
sudo systemctl daemon-reload
sudo systemctl enable Web.service
sudo systemctl start Web.service

#sudo systemctl status Web.service

#Receiver
cp Receiver.service /lib/systemd/system/

sudo chmod 644 /lib/systemd/system/Receiver.service
sudo systemctl daemon-reload
sudo systemctl enable Receiver.service
sudo systemctl start Receiver.service

#sudo systemctl status Receiver.service

# Check status
#sudo systemctl status Receiver.service
 
# Start service
#sudo systemctl start Receiver.service
 
# Stop service
#sudo systemctl stop Receiver.service
 
# Check service's log
#sudo journalctl -f -u Receiver.service